import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { fetchAuthSession } from 'aws-amplify/auth';

// Helper to get ID token
const fetchUserAuthToken = async () => {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();
  if (!token) throw new Error("No ID token found");
  return token;
};

// Helper function to determine status color
const getStatusPill = (progress) => {
  let bgColor, textColor, SvgIcon;
  switch (progress?.toLowerCase()) {
    case 'to-do':
      bgColor = 'bg-gray-100'; textColor = 'text-gray-700';
      SvgIcon = () => <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="7"/></svg>;
      break;
    case 'in progress':
      bgColor = 'bg-blue-100'; textColor = 'text-blue-700';
      SvgIcon = () => <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd"/></svg>;
      break;
    case 'done':
      bgColor = 'bg-green-100'; textColor = 'text-green-700';
      SvgIcon = () => <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>;
      break;
    case 'canceled':
      bgColor = 'bg-red-100'; textColor = 'text-red-700';
      SvgIcon = () => <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>;
      break;
    default:
      bgColor = 'bg-gray-100'; textColor = 'text-gray-600';
      SvgIcon = () => <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="7"/></svg>;
  }
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${bgColor} ${textColor}`}>
      {SvgIcon && <SvgIcon />}
      {progress || 'N/A'}
    </span>
  );
};

const formatDate = (dateString) => {
  if (!dateString) return 'Not set';
  try {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = await fetchUserAuthToken();
        const response = await axios.get(
          `https://mye64ogig2.execute-api.eu-north-1.amazonaws.com/stage-cors/task/${id}`,
          { headers: { Authorization: token } }
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
        console.error('Error fetching task:', err);
        setError('Failed to load task. Try again.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTask();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      const token = await fetchUserAuthToken();
      await axios.delete(
        `https://mye64ogig2.execute-api.eu-north-1.amazonaws.com/stage-cors/task/${id}`,
        { headers: { Authorization: token } }
      );
      navigate('/tasks');
    } catch (err) {
      console.error('Error deleting task:', err);
      alert(`Failed to delete task: ${err.message || 'Unknown error'}`);
    }
  };

  if (loading) return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-600 text-lg">Loading task details...</p>
    </div>
  );

  if (error) return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <p className="text-red-600 text-lg">{error}</p>
      <Link to="/tasks" className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg">Back to Tasks</Link>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      <header className="py-4 px-6 md:px-12 bg-white shadow-sm sticky top-0 border-b border-gray-200 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-purple-600">SpaceTaskManager</Link>
          <nav className="flex items-center space-x-4">
            <Link to="/tasks" className="text-gray-600 hover:text-purple-600 font-medium">My Tasks</Link>
            {user && (
              <>
                <Link to={`/tasks/${id}/edit`} className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg">Edit Task</Link>
                <button
                  onClick={handleDelete}
                  className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                >
                  Delete Task
                </button>
                <button
                  onClick={signOut}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium"
                >
                  Sign Out
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow-lg border space-y-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{task.title}</h1>
          <p><span className="font-semibold">Description:</span> {task.description || 'No description provided.'}</p>
          <p><span className="font-semibold">Due Date:</span> {formatDate(task.dueDate)}</p>
          <p><span className="font-semibold">Priority:</span> {task.priority || 'Not set'}</p>
          <p><span className="font-semibold">Status:</span> {getStatusPill(task.status)}</p>
          {task.attachmentUrl && (
            <p><span className="font-semibold">Attachment:</span> <a href={task.attachmentUrl} className="text-purple-600 underline" target="_blank" rel="noopener noreferrer">View File</a></p>
          )}
        </div>
      </main>

      <footer className="w-full py-8 bg-gray-100 text-center text-sm text-gray-600 border-t border-gray-200">
        <p>&copy; {new Date().getFullYear()} Space Task Manager. All rights reserved.</p>
      </footer>
    </div>
  );
}
