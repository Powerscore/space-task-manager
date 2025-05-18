import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import TaskCard from "../components/TaskCard";
import { useAuth } from "../AuthContext";
import { fetchAuthSession } from "aws-amplify/auth";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString(); // JWT

        if (!token) throw new Error("No ID token found");

        const response = await axios.get(
          "https://mye64ogig2.execute-api.eu-north-1.amazonaws.com/stage-cors/tasks",
          {
            headers: {
              Authorization: token,
            },
          }
        );

        const rawTasks = response.data?.tasks || [];
        const parsedTasks = rawTasks.map((item) => ({
          id: item.task_id?.S,
          title: item.title?.S,
          description: item.description?.S,
          dueDate: item.dueDate?.S,
          priority: item.priority?.S,
          status: item.status?.S,
          attachmentUrl: item.attachmentUrl?.S,
          createdAt: item.createdAt?.S,
          updatedAt: item.updatedAt?.S,
        }));
        setTasks(parsedTasks);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      {/* Header/Navigation Area */}
      <header className="py-4 px-6 md:px-12 shadow-sm border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-purple-600">
            SpaceTaskManager
          </Link>
          <nav className="flex items-center space-x-4">
            <Link to="/tasks" className="text-purple-600 font-semibold">
              My Tasks
            </Link>
            {user && (
              <button
                onClick={signOut}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors">
                Sign Out
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Your Tasks
          </h1>
          <Link
            to="/tasks/new"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md text-base font-semibold transition-all duration-300 transform hover:scale-105">
            + New Task
          </Link>
        </div>

        {/* Task List */}
        {tasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">
              You have no tasks yet. Create one to get started!
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
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
