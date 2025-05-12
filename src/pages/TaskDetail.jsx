import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext'; // Assuming AuthContext is in src/

// Helper function to determine status color - customize as needed
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

// Basic date formatting
const formatDate = (dateString, options = { year: 'numeric', month: 'long', day: 'numeric' }) => {
  if (!dateString) return 'Not set';
  try {
    return new Date(dateString).toLocaleDateString(undefined, options);
  } catch (error) {
    console.warn("Invalid date string for formatting:", dateString, error);
    return dateString; // Fallback
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
    setLoading(true);
    axios.get(`https://mye64ogig2.execute-api.eu-north-1.amazonaws.com/stage-cors/task/${id}`)
      .then(r => {
        setTask(r.data);
        setError(null);
      })
      .catch(err => {
        console.error("Error fetching task details:", err);
        setError("Failed to load task details.");
        setTask(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(`https://mye64ogig2.execute-api.eu-north-1.amazonaws.com/stage-cors/task/${id}`);
        navigate('/tasks');
      } catch (err) {
        console.error("Error deleting task:", err);
        alert("Failed to delete task. Please try again.");
      }
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
        <Link to="/tasks" className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">Back to Tasks</Link>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-lg text-gray-600">Task not found.</p>
        <Link to="/tasks" className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">Back to Tasks</Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      <header className="py-4 px-6 md:px-12 shadow-sm border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-purple-600">
            SpaceTaskManager
          </Link>
          <nav className="flex items-center space-x-4">
            <Link to="/tasks" className="text-gray-600 hover:text-purple-600 font-medium">My Tasks</Link>
            {user && (
              <button 
                onClick={signOut} 
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Sign Out
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow-lg border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-6 border-b border-gray-200">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-0">
              {task.title || 'Task Details'}
            </h1>
            <div className="flex space-x-3 mt-2 sm:mt-0">
              <Link 
                to={`/tasks/${id}/edit`} 
                className="px-5 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-sm font-semibold transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"/><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"/></svg>
                Edit
              </Link>
              <button 
                onClick={handleDelete}
                className="px-5 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-semibold transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                Delete
              </button>
            </div>
          </div>

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
                {getStatusPill(task.progress)}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Deadline</h3>
                <p className="text-gray-700 font-medium">{formatDate(task.deadline)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Created At</h3>
                <p className="text-gray-700 text-xs">{formatDate(task.createdAt, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Last Updated</h3>
                <p className="text-gray-700 text-xs">{formatDate(task.updatedAt, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          </div>

          {task.attachments && task.attachments.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Attachments</h3>
              <ul className="space-y-2">
                {task.attachments.map((att, index) => (
                  <li key={index} className="text-sm text-purple-600 hover:underline">
                    <a href={att.url} target="_blank" rel="noopener noreferrer">{att.filename || `Attachment ${index + 1}`}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}

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