import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import TaskForm from "../components/TaskForm";
import { useAuth } from "../AuthContext";
import { fetchAuthSession } from "@aws-amplify/auth";
import { useDropzone } from "react-dropzone";

const fetchUserAuthToken = async () => {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();
  if (!token) throw new Error("No ID token found");
  return token;
};

export default function TaskEdit({ isNew }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) setFile(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    if (!isNew && id) {
      (async () => {
        try {
          const token = await fetchUserAuthToken();
          const resp = await axios.get(
            `https://mye64ogig2.execute-api.eu-north-1.amazonaws.com/stage-cors/task/${id}`,
            { headers: { Authorization: token } }
          );
          const raw = resp.data;
          setInitialData({
            id: raw.task_id.S,
            title: raw.title.S,
            description: raw.description.S,
            dueDate: raw.dueDate.S,
            priority: raw.priority.S,
            status: raw.status.S,
            attachmentUrl: raw.attachmentUrl.S,
          });
          setError(null);
        } catch (err) {
          console.error(err);
          setError("Failed to load task. Try again.");
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [id, isNew]);

  if (!isNew && loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <p>Loading task for editing…</p>
      </div>
    );
  }

  const handleSave = async (data) => {
    try {
      const token = await fetchUserAuthToken();
      let taskId = id;
      const urlBase =
        "https://mye64ogig2.execute-api.eu-north-1.amazonaws.com/stage-cors/task";

      if (isNew) {
        console.log("Creating new task");
        console.log("Data:", data);
        const { data: createResp } = await axios.post(urlBase, data, {
          headers: { Authorization: token },
        });
        taskId = createResp.id;
      }

      let attachmentUrl = data.attachmentUrl || "";

      if (file) {
        const filename = file.name;
        const presignEndpoint = `${urlBase}/${taskId}/attachments`;

        // PUT to get upload URL
        const { data: uploadResp } = await axios.put(presignEndpoint, null, {
          headers: { Authorization: token },
          params: { key: filename },
        });
        const uploadUrl = uploadResp.uploadUrl;

        // Upload the file
        const uploadResult = await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type || "application/octet-stream" },
        });
        if (!uploadResult.ok)
          throw new Error(`Upload failed (${uploadResult.status})`);

        attachmentUrl = `${filename}`;
      }

      // Persist task update
      const rawPayload = {
        ...data,
        attachmentUrl,
        dueDate: data.dueDate,
        priority: data.priority,
        status: data.status,
        title: data.title?.trim(),
      };
      
      // Remove empty string, null, or undefined fields
      const payload = Object.fromEntries(
        Object.entries(rawPayload).filter(
          ([_, v]) => v !== undefined && v !== null && v !== ""
        )
      );
      
      console.log("Data to save:", data);
      console.log("Payload in patching:", payload);
      await axios.patch(`${urlBase}/${taskId}`, payload, {
        headers: { Authorization: token },
      });

      navigate(`/tasks/${taskId}`);
    } catch (err) {
      console.error(err);
      alert(`Failed to save task: ${err.message}`);
    }
  };

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
              className="text-gray-600 hover:text-purple-600">
              Calendar
            </Link>
            {user && (
              <button
                onClick={signOut}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm">
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
            }`}>
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
            initialData={{
              ...initialData,
              attachmentUrl: file
                ? file.name
                : initialData?.attachmentUrl || "",
            }}
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
