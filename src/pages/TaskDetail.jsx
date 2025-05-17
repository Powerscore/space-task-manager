import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { fetchAuthSession } from '@aws-amplify/auth';
import { useAuth } from '../AuthContext'; 

// Helper to grab the Cognito ID token
const fetchUserAuthToken = async () => {
  const session = await fetchAuthSession();
  const token   = session?.tokens?.idToken?.toString();
  if (!token) throw new Error("No ID token found");
  return token;
};

// Status‑pill component (unchanged)
const getStatusPill = (progress) => {
  /* …your existing switch/return… */
};

// Date formatter (unchanged)
const formatDate = (dateString, options = { year: 'numeric', month: 'long', day: 'numeric' }) => {
  /* …your existing logic… */
};

export default function TaskDetail() {
  const { id }       = useParams();
  const [task, setTask]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const { user, signOut }    = useAuth();
  const navigate             = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // 1) get auth token
        const token = await fetchUserAuthToken();

        // 2) fetch task with Authorization header
        const resp = await axios.get(
          `https://mye64ogig2.execute-api.eu-north-1.amazonaws.com/stage-cors/task/${id}`,
          { headers: { Authorization: token } }
        );
        setTask(resp.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching task details:", err);
        setError("Failed to load task details.");
        setTask(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const token = await fetchUserAuthToken();
      await axios.delete(
        `https://mye64ogig2.execute-api.eu-north-1.amazonaws.com/stage-cors/task/${id}`,
        { headers: { Authorization: token } }
      );
      navigate('/tasks');
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Failed to delete task. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-lg text-gray-600">Loading task details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-lg text-red-600">{error}</p>
        <Link to="/tasks" className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
          Back to Tasks
        </Link>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-lg text-gray-600">Task not found.</p>
        <Link to="/tasks" className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
          Back to Tasks
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      <header className="py-4 px-6 md:px-12 shadow-sm border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-purple-600">SpaceTaskManager</Link>
          <nav className="flex items-center space-x-4">
            <Link to="/tasks" className="text-gray-600 hover:text-purple-600 font-medium">My Tasks</Link>
            {user && (
              <button
                onClick={signOut}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium"
              >
                Sign Out
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow-lg border border-gray-200">
          {/* Title + actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-6 border-b border-gray-200">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-0">
              {task.title || 'Task Details'}
            </h1>
            <div className="flex space-x-3 mt-2 sm:mt-0">
              <Link
                to={`/tasks/${id}/edit`}
                className="px-5 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-sm font-semibold transition-colors flex items-center"
              >
                {/* …edit icon… */} Edit
              </Link>
              <button
                onClick={handleDelete}
                className="px-5 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-semibold transition-colors flex items-center"
              >
                {/* …delete icon… */} Delete
              </button>
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {task.description || 'No description provided.'}
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                {getStatusPill(task.status)}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Deadline</h3>
                <p className="text-gray-700 font-medium">{formatDate(task.dueDate)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Created At</h3>
                <p className="text-gray-700 text-xs">
                  {formatDate(task.createdAt, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Last Updated</h3>
                <p className="text-gray-700 text-xs">
                  {formatDate(task.updatedAt, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>

          {/* Attachments */}
          {task.attachments?.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Attachments</h3>
              <ul className="space-y-2">
                {task.attachments.map((att, idx) => (
                  <li key={idx} className="text-sm text-purple-600 hover:underline">
                    <a href={att.url} target="_blank" rel="noopener noreferrer">
                      {att.filename || `Attachment ${idx + 1}`}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Back link */}
          <div className="mt-10 text-center">
            <Link to="/tasks" className="text-purple-600 hover:text-purple-800 font-medium transition-colors">
              &larr; Back to All Tasks
            </Link>
          </div>

        </div>
      </main>

      <footer className="w-full py-8 bg-gray-100 border-t border-gray-200 text-gray-600 text-center text-sm">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} Space Task Manager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
