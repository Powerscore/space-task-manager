import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "react-oidc-context";

// Helper function to determine status color
const getStatusPill = (status) => {
  let bgColor, textColor, SvgIcon;
  switch (status?.toLowerCase()) {
    case "to-do":
      bgColor = "bg-gray-100";
      textColor = "text-gray-700";
      SvgIcon = () => (
        <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="7" />
        </svg>
      );
      break;
    case "in progress":
      bgColor = "bg-blue-100";
      textColor = "text-blue-700";
      SvgIcon = () => (
        <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
            clipRule="evenodd"
          />
        </svg>
      );
      break;
    case "done":
      bgColor = "bg-green-100";
      textColor = "text-green-700";
      SvgIcon = () => (
        <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      );
      break;
    case "canceled":
      bgColor = "bg-red-100";
      textColor = "text-red-700";
      SvgIcon = () => (
        <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      );
      break;
    default:
      bgColor = "bg-gray-100";
      textColor = "text-gray-600";
      SvgIcon = () => (
        <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="7" />
        </svg>
      );
  }
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${bgColor} ${textColor}`}>
      {SvgIcon && <SvgIcon />}
      {status || "N/A"}
    </span>
  );
};

const formatDate = (dateString) => {
  if (!dateString) return "Not set";
  try {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

export default function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      if (!auth.user?.id_token) {
        setError("Authentication token is missing. Please sign in.");
        setLoading(false);
        return;
      }
      try {
        const token = auth.user.id_token;
        const response = await axios.get(
          `https://mye64ogig2.execute-api.eu-north-1.amazonaws.com/stage-cors/task/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const raw = response.data.task;
        setTask({
          id: raw.task_id?.S,
          title: raw.title?.S,
          description: raw.description?.S,
          dueDate: raw.dueDate?.S,
          priority: raw.priority?.S,
          status: raw.status?.S,
          attachmentUrl: raw.attachmentUrl?.S,
        });
        setError(null);
      } catch (err) {
        console.error("Error fetching task:", err);
        setError("Failed to load task. Try again.");
      } finally {
        setLoading(false);
      }
    };
    if (id && auth.isAuthenticated) {
      fetchTask();
    } else if (!auth.isLoading && !auth.isAuthenticated) {
      setError("Please sign in to view task details.");
      setLoading(false);
    }
  }, [id, auth.isAuthenticated, auth.isLoading, auth.user?.id_token]);

  const handleDelete = async () => {
    if (!auth.user?.id_token) {
      alert("Authentication token is missing. Please sign in.");
      return;
    }
    try {
      const token = auth.user.id_token;
      await axios.delete(
        `https://mye64ogig2.execute-api.eu-north-1.amazonaws.com/stage-cors/task/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/tasks");
    } catch (err) {
      console.error("Error deleting task:", err);
      alert(`Failed to delete task: ${err.message || "Unknown error"}`);
    }
  };

  const handleGetAttachment = async () => {
    if (!task?.attachmentUrl) return;
    if (!auth.user?.id_token) {
      alert("Authentication token is missing. Please sign in.");
      return;
    }
    console.log("[LOG] handleGetAttachment: start");
    try {
      const token = auth.user.id_token;
      const response = await axios.get(
        `https://mye64ogig2.execute-api.eu-north-1.amazonaws.com/stage-cors/task/${id}/attachments`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { key: task.attachmentUrl },
        }
      );
      console.log("[LOG] handleGetAttachment: response:", response.data);
      const downloadUrl = response.data.downloadUrl;
      console.log("[LOG] handleGetAttachment: downloadUrl:", downloadUrl);
      window.open(downloadUrl, "_blank");
    } catch (err) {
      console.error("Error fetching attachment URL:", err);
      alert(`Failed to get attachment: ${err.message || "Unknown error"}`);
    }
  };

  const handleSignOut = () => {
    const postLogoutRedirectUri = window.location.origin + "/";
    auth.signoutRedirect({ post_logout_redirect_uri: postLogoutRedirectUri });
  };

  if (loading)
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Loading task details...</p>
      </div>
    );

  if (error && !auth.isAuthenticated && !auth.isLoading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <p className="text-red-600 text-lg mb-4">{error}</p>
        <button
          onClick={() => auth.signinRedirect()}
          className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Sign In
        </button>
        <Link
          to="/tasks"
          className="mt-4 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors ml-2">
          Back to Tasks
        </Link>
      </div>
    );
  } else if (error) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <p className="text-red-600 text-lg">{error}</p>
        <Link
          to="/tasks"
          className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg">
          Back to Tasks
        </Link>
      </div>
    );
  }

  if (!auth.isAuthenticated && !auth.isLoading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <p className="text-gray-700 text-lg mb-4">
          Please sign in to view this task.
        </p>
        <button
          onClick={() => auth.signinRedirect()}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Sign In
        </button>
      </div>
    );
  }

  if (!task && !loading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <p className="text-gray-700 text-lg">
          Task not found or could not be loaded.
        </p>
        <Link
          to="/tasks"
          className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Back to Tasks
        </Link>
      </div>
    );
  }

  if (!task) return null;

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      <header className="py-4 px-6 md:px-12 shadow-sm border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-purple-600">
            SpaceTaskManager
          </Link>

          {/* Hamburger Menu Button (visible on small screens) */}
          <button
            className="md:hidden text-gray-600 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link
              to="/tasks"
              className="text-purple-600 hover:text-purple-800 font-semibold">
              My Tasks
            </Link>
            <Link
              to="/calendar"
              className="text-gray-600 hover:text-purple-600 font-medium">
              Calendar
            </Link>
            <Link
              to="/profile"
              className="text-gray-600 hover:text-purple-600 font-medium">
              Profile
            </Link>
            {auth.user?.profile?.email && (
              <span className="text-sm text-gray-700 hidden md:inline">
                Hello, {auth.user.profile.email}
              </span>
            )}
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors">
              Sign Out
            </button>
          </nav>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 space-y-2 px-2">
            <Link
              to="/tasks"
              className="block text-purple-600 font-semibold"
              onClick={() => setMenuOpen(false)}>
              My Tasks
            </Link>
            <Link
              to="/calendar"
              className="block text-gray-600 font-medium"
              onClick={() => setMenuOpen(false)}>
              Calendar
            </Link>
            <Link
              to="/profile"
              className="block text-gray-600 font-medium"
              onClick={() => setMenuOpen(false)}>
              Profile
            </Link>
            {auth.user?.profile?.email && (
              <span className="block text-sm text-gray-700">
                Hello, {auth.user.profile.email}
              </span>
            )}
            <button
              onClick={() => {
                setMenuOpen(false);
                handleSignOut();
              }}
              className="w-full text-left px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium">
              Sign Out
            </button>
          </div>
        )}
      </header>

      <main className="flex-grow container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow-lg border space-y-6 relative">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {task.title}
          </h1>
          <p>
            <span className="font-semibold">Description:</span>{" "}
            {task.description || "No description provided."}
          </p>
          <p>
            <span className="font-semibold">Due Date:</span>{" "}
            {formatDate(task.dueDate)}
          </p>
          <p>
            <span className="font-semibold">Priority:</span>{" "}
            {task.priority || "Not set"}
          </p>
          <p>
            <span className="font-semibold">Status:</span>{" "}
            {getStatusPill(task.status)}
          </p>
          {task.attachmentUrl && (
            <div className="py-2">
              <span className="font-semibold">Attachment:</span>{" "}
              <button
                onClick={handleGetAttachment}
                className="ml-2 text-purple-600 hover:text-purple-800 underline">
                {task.attachmentUrl} (Download)
              </button>
            </div>
          )}

          {auth.isAuthenticated && (
            <div className="mt-6 flex flex-wrap gap-3 justify-end">
              <Link
                to="/tasks"
                className="px-4 py-2 !bg-gray-100 border border-gray-300 hover:!bg-gray-200 text-gray-800 rounded-lg transition">
                Back
              </Link>
              <Link
                to={`/tasks/${id}/edit`}
                className="px-4 py-2 !bg-indigo-600 hover:!bg-indigo-700 text-white rounded-lg transition">
                Edit Task
              </Link>
              <button
                onClick={() => setShowConfirm(true)}
                className="px-4 py-2 !bg-red-600 hover:!bg-red-700 text-white rounded-lg transition">
                Delete
              </button>
            </div>
          )}
        </div>

        {showConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-4 rounded shadow text-center space-y-4">
              <p>Are you sure you want to delete this task?</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-3 py-1 bg-gray-200 rounded">
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1 bg-red-500 text-white rounded">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="w-full py-8 bg-gray-100 text-center text-sm text-gray-600 border-t border-gray-200">
        <p>
          &copy; {new Date().getFullYear()} Space Task Manager. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
