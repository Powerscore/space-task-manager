import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import TaskForm from '../components/TaskForm';
import { useAuth } from '../AuthContext';
import { fetchAuthSession } from 'aws-amplify/auth';

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

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = await fetchUserAuthToken();
        const response = await axios.get(
          `https://mye64ogig2.execute-api.eu-north-1.amazonaws.com/stage-cors/task/${id}`,
          {
            headers: { Authorization: token }
          }
        );

        const raw = response.data;
        const unwrapped = {
          id: raw.task_id?.S,
          title: raw.title?.S,
          description: raw.description?.S,
          dueDate: raw.dueDate?.S,
          priority: raw.priority?.S,
          status: raw.status?.S,
          attachmentUrl: raw.attachmentUrl?.S,
        };

        setInitialData(unwrapped);
        setError(null);
      } catch (err) {
        console.error("Error fetching task:", err);
        setError("Failed to load task. Try again.");
      } finally {
        setLoading(false);
      }
    };

    if (!isNew && id) {
      fetchTask();
    }
  }, [id, isNew]);

  const handleSave = async (data) => {
    try {
      const token = await fetchUserAuthToken();

      const url = isNew
        ? 'https://mye64ogig2.execute-api.eu-north-1.amazonaws.com/stage-cors/task'
        : `https://mye64ogig2.execute-api.eu-north-1.amazonaws.com/stage-cors/task/${id}`;

      const method = isNew ? 'post' : 'patch';
      const sanitized = {
  ...data,
  title: data.title?.trim(),
  dueDate: data.dueDate,
  priority: data.priority || 'Medium',
  status: data.status || 'Not Started',
  attachmentUrl: data.attachmentUrl || '',
};


      const response = await axios[method](url, sanitized, {
        headers: { Authorization: token }
      });

      const newId = isNew ? response.data.id : id;
      navigate(`/tasks/${newId}`);
    } catch (err) {
      console.error("Error saving task:", err);
      alert(`Failed to save task: ${err.message || 'Unknown error'}`);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-lg text-gray-600">Loading task for editing...</p>
      </div>
    );
  }

  if (error && !isNew) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-lg text-red-600">{error}</p>
        <Link to="/tasks" className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg">Back to Tasks</Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      <header className="py-4 px-6 md:px-12 bg-white shadow-sm sticky top-0 border-b border-gray-200 z-50">
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
        <div className="max-w-2xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow-lg border">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
            {isNew ? 'Create New Task' : 'Edit Task'}
          </h1>
          <TaskForm
            initialData={initialData}
            onSave={handleSave}
            isNew={isNew}
          />
        </div>
      </main>

      <footer className="w-full py-8 bg-gray-100 text-center text-sm text-gray-600 border-t border-gray-200">
        <p>&copy; {new Date().getFullYear()} Space Task Manager. All rights reserved.</p>
      </footer>
    </div>
  );
}
