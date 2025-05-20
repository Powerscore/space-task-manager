import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import TaskCard from "../components/TaskCard";
import { useAuth } from 'react-oidc-context';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const auth = useAuth();
  console.log("Tasks.jsx: auth", auth);

  useEffect(() => {
    const performFetchTasks = async () => {
      if (!auth.user?.id_token) {
        console.error("Tasks.jsx: performFetchTasks called but ID token is unexpectedly missing.");
        setFetchError("Authentication token error. Please refresh or sign in again.");
        setTasks([]);
        return;
      }

      setFetchError(null);
      try {
        const token = auth.user.id_token;
        const response = await axios.get(
          "https://mye64ogig2.execute-api.eu-north-1.amazonaws.com/stage-cors/tasks",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const rawTasks = response.data?.tasks || [];
        const parsedTasks = rawTasks
          .map((item) => ({
            id: item.task_id?.S,
            title: item.title?.S,
            description: item.description?.S,
            dueDate: item.dueDate?.S,
            priority: item.priority?.S,
            status: item.status?.S,
            attachmentUrl: item.attachmentUrl?.S,
            createdAt: item.createdAt?.S,
            updatedAt: item.updatedAt?.S,
          }))
          .sort((a, b) => {
            const da = new Date(a.dueDate).getTime();
            const db = new Date(b.dueDate).getTime();
            return da - db;
          });
        setTasks(parsedTasks);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setFetchError(err.response?.data?.message || err.message || "Failed to fetch tasks.");
        setTasks([]);
      }
    };

    if (auth.isAuthenticated && auth.user?.id_token) {
      performFetchTasks();
    } else if (auth.isAuthenticated && !auth.user?.id_token && !auth.isLoading) {
      console.warn("Tasks.jsx: Authenticated, but ID token not yet available. Waiting for token to be populated.");
      setFetchError("Waiting for user session to fully load...");
      setTasks([]);
    } else if (!auth.isLoading && !auth.isAuthenticated) {
      setTasks([]);
      setFetchError(null);
    }
  }, [auth.isAuthenticated, auth.isLoading, auth.user?.id_token]);

  const handleSignOut = () => {
    const postLogoutRedirectUri = window.location.origin + '/';
    auth.signoutRedirect({ post_logout_redirect_uri: postLogoutRedirectUri });
  };

  if (auth.isLoading) {
    return <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center text-lg">Loading authentication...</div>;
  }

  if (auth.error) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl text-red-600 mb-4">Authentication Error</h2>
        <p className="text-red-700 bg-red-100 p-3 rounded-md">{auth.error.message}</p>
        <button
          onClick={() => auth.signinRedirect()}
          className="mt-6 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md text-base font-semibold"
        >
          Try Sign In Again
        </button>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center">
        <header className="w-full py-4 px-6 md:px-12 border-b border-gray-200 bg-white">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-purple-600">
              SpaceTaskManager
            </Link>
          </div>
        </header>
        <main className="flex-grow container mx-auto flex flex-col items-center justify-center py-12 px-4">
          <p className="text-xl text-gray-700 mb-6">Please sign in to manage your tasks.</p>
          <button
            onClick={() => auth.signinRedirect()}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md text-lg font-semibold transition-colors"
          >
            Sign In
          </button>
        </main>
        <footer className="w-full py-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Space Task Manager
        </footer>
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
            <Link to="/tasks" className="text-purple-600 hover:text-purple-800 font-semibold">
              My Tasks
            </Link>
            <Link
              to="/calendar"
              className="text-gray-600 hover:text-purple-600 font-medium">
              Calendar
            </Link>
            <Link to="/profile" className="text-gray-600 hover:text-purple-600 font-medium">Profile</Link>
            {auth.user?.profile?.email && <span className="text-sm text-gray-700 hidden md:inline">Hello, {auth.user.profile.email}</span>}
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors">
              Sign Out
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Your Tasks
          </h1>
          <div className="flex space-x-4">
            <Link
              to="/tasks/new"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md text-base font-semibold transition-all duration-300 transform hover:scale-105">
              + New Task
            </Link>
          </div>
        </div>

        {fetchError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md shadow">
            <p><strong>Error loading tasks:</strong> {fetchError}</p>
          </div>
        )}

        {tasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          !fetchError && ( 
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">
                You have no tasks yet. Create one to get started!
              </p>
            </div>
          )
        )}
      </main>

      <footer className="w-full py-8 bg-gray-100 border-t border-gray-200 text-gray-600 text-center text-sm">
        <div className="container mx-auto">
          <p>
            &copy; {new Date().getFullYear()} Space Task Manager. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
