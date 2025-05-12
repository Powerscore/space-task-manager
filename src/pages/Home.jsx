import React from 'react';
import { Link } from 'react-router-dom';
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h1 className="text-5xl font-bold mb-6 text-purple-700 tracking-tight">🚀 Space Task Manager</h1>
      <Link
        to="/tasks"
        className="mt-4 px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow transition-colors duration-200 text-lg font-medium"
      >
        View Tasks
      </Link>
    </div>
  );
}