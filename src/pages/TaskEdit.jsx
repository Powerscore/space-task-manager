import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TaskForm from '../components/TaskForm';
import { useAuth } from '../AuthContext';
import { Link } from 'react-router-dom';

export default function TaskEdit({ isNew }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isNew && id) {
      setLoading(true);
      axios.get(`https://mye64ogig2.execute-api.eu-north-1.amazonaws.com/stage-cors/task/${id}`)
        .then(r => {
          setInitialData(r.data);
          setError(null);
        })
        .catch(err => {
          console.error("Error fetching task for editing:", err);
          setError("Failed to load task data. Please try again or create a new task.");
          setInitialData(null);
        })
        .finally(() => setLoading(false));
    }
  }, [id, isNew]);

  const handleSave = async (data) => {
    try {
      if (isNew) {
        const response = await axios.post('https://mye64ogig2.execute-api.eu-north-1.amazonaws.com/stage-cors/task', data);
        navigate(`/tasks/${response.data.id || ''}`);
      } else {
        await axios.patch(`https://mye64ogig2.execute-api.eu-north-1.amazonaws.com/stage-cors/task/${id}`, data);
        navigate(`/tasks/${id}`);
      }
    } catch (err) {
      console.error("Error saving task:", err);
      alert(`Failed to save task: ${err.message || 'Unknown error'}. Please try again.`);
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
        <div className="max-w-2xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow-lg border border-gray-200">
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

      <footer className="w-full py-8 bg-gray-100 border-t border-gray-200 text-gray-600 text-center text-sm">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} Space Task Manager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}