import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import TaskForm from "../components/TaskForm";
import { useAuth } from "react-oidc-context";
import { useDropzone } from "react-dropzone";

export default function TaskEdit({ isNew }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(!isNew);
  const [pageError, setPageError] = useState(null);
  const [file, setFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) setFile(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    if (!isNew && id && auth.isAuthenticated) {
      setLoading(true);
      (async () => {
        if (!auth.user?.id_token) {
          setPageError("Authentication token is missing. Please sign in.");
          setLoading(false);
          return;
        }
        try {
          const token = auth.user.id_token;
          const resp = await axios.get(
            `https://mye64ogig2.execute-api.eu-north-1.amazonaws.com/stage-cors/task/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const raw = resp.data.task;
          setInitialData({
            id: raw.task_id?.S,
            title: raw.title?.S,
            description: raw.description?.S,
            dueDate: raw.dueDate?.S,
            priority: raw.priority?.S,
            status: raw.status?.S,
            attachmentUrl: raw.attachmentUrl?.S,
          });
          setPageError(null);
        } catch (err) {
          console.error("Error fetching task for edit:", err);
          setPageError(
            err.response?.data?.message ||
              err.message ||
              "Failed to load task. Try again."
          );
        } finally {
          setLoading(false);
        }
      })();
    } else if (!isNew && id && !auth.isLoading && !auth.isAuthenticated) {
      setPageError("Please sign in to edit this task.");
      setLoading(false);
    } else if (isNew) {
      setLoading(false);
    }
  }, [id, isNew, auth.isAuthenticated, auth.isLoading, auth.user?.id_token]);

  const handleSave = async (data) => {
    if (!auth.user?.id_token) {
      alert("Authentication token is missing. Please sign in to save.");
      return;
    }
    try {
      const token = auth.user.id_token;
      let taskId = id;
      const urlBase =
        "https://mye64ogig2.execute-api.eu-north-1.amazonaws.com/stage-cors/task";

      if (isNew) {
        console.log("Creating new task");
        const { data: createResp } = await axios.post(urlBase, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        taskId = createResp.id;
      }

      let attachmentUrl = data.attachmentUrl || "";

      if (file) {
        const filename = file.name;
        const presignEndpoint = `${urlBase}/${taskId}/attachments`;

        const { data: uploadResp } = await axios.put(presignEndpoint, null, {
          headers: { Authorization: `Bearer ${token}` },
          params: { key: filename },
        });
        const uploadUrl = uploadResp.uploadUrl;

        const uploadResult = await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type || "application/octet-stream" },
        });
        if (!uploadResult.ok)
          throw new Error(`Upload failed (${uploadResult.status})`);

        attachmentUrl = filename;
      }

      const rawPayload = {
        ...data,
        attachmentUrl,
      };
      const payload = Object.fromEntries(
        Object.entries(rawPayload).filter(
          ([/* _ */, v]) =>
            v !== undefined &&
            v !== null &&
            (typeof v !== "string" || v.trim() !== "")
        )
      );

      if (!isNew && Object.keys(payload).length > 0) {
        await axios.patch(`${urlBase}/${taskId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (
        isNew &&
        Object.keys(payload).length > 0 &&
        attachmentUrl &&
        !data.attachmentUrl
      ) {
        await axios.patch(
          `${urlBase}/${taskId}`,
          { attachmentUrl },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      navigate(`/tasks/${taskId}`);
    } catch (err) {
      console.error("Error saving task:", err);
      alert(
        `Failed to save task: ${
          err.response?.data?.message || err.message || "Unknown error"
        }`
      );
    }
  };

  const handleSignOut = () => {
    const postLogoutRedirectUri = window.location.origin + "/";
    auth.signoutRedirect({ post_logout_redirect_uri: postLogoutRedirectUri });
  };

  if (auth.isLoading || (!isNew && loading)) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 text-lg">
        Loading...
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <p className="text-red-600 text-lg mb-4">{pageError}</p>
        {!auth.isAuthenticated && !auth.isLoading && (
          <button
            onClick={() => auth.signinRedirect()}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Sign In
          </button>
        )}
        <Link
          to="/tasks"
          className="mt-4 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors ml-2"
        >
          Back to Tasks
        </Link>
      </div>
    );
  }

  if (!auth.isAuthenticated && !auth.isLoading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <p className="text-gray-700 text-lg mb-4">
          Please sign in to {isNew ? "create" : "edit"} a task.
        </p>
        <button
          onClick={() => auth.signinRedirect()}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      <header className="py-4 px-6 bg-white shadow sticky top-0">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-purple-600">
            SpaceTaskManager
          </Link>
          <nav className="flex items-center space-x-4">
            <Link to="/tasks" className="text-gray-600 hover:text-purple-600">
              My Tasks
            </Link>
            <Link
              to="/calendar"
              className="text-gray-600 hover:text-purple-600"
            >
              Calendar
            </Link>
            <Link to="/profile" className="text-gray-600 hover:text-purple-600 font-medium">Profile</Link>
            {auth.isAuthenticated && (
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm"
              >
                Sign Out
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow-lg border space-y-6">
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            {isNew ? "Create New Task" : "Edit Task"}
          </h1>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed p-6 rounded-lg text-center ${
              isDragActive
                ? "border-purple-400 bg-purple-50"
                : "border-gray-300 bg-white"
            }`}
          >
            <input {...getInputProps()} />
            {file ? (
              <p className="text-gray-800">
                Selected file: <strong>{file.name}</strong>
              </p>
            ) : (
              <p className="text-gray-500">
                Drag & drop a file here, or click to select
              </p>
            )}
          </div>

          <TaskForm
            initialData={
              initialData || { attachmentUrl: file ? file.name : "" }
            }
            onSave={handleSave}
            isNew={isNew}
          />
        </div>
      </main>

      <footer className="py-8 bg-gray-100 text-center text-sm text-gray-600 border-t">
        &copy; {new Date().getFullYear()} Space Task Manager. All rights
        reserved.
      </footer>
    </div>
  );
}
