import React from 'react';
import { Link } from 'react-router-dom';

// Helper function to determine status color - customize as needed
const getStatusColor = (progress) => {
  switch (progress.toLowerCase()) {
    case 'to-do':
      return 'bg-gray-200 text-gray-700';
    case 'in progress':
      return 'bg-blue-200 text-blue-700';
    case 'done':
      return 'bg-green-200 text-green-700';
    case 'canceled':
      return 'bg-red-200 text-red-700';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

export default function TaskCard({ task }) {
  if (!task) return null;

  // Basic date formatting (consider using a library like date-fns for more complex needs)
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString(undefined, { 
        year: 'numeric', month: 'short', day: 'numeric' 
      });
    } catch (error) {
      console.warn("Invalid date string for formatting:", dateString, error); // Log the error and the problematic date
      return dateString; // Fallback if date is not valid
    }
  };

  return (
    <Link to={`/tasks/${task.id}`} className="block group">
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 h-full flex flex-col">
        {/* Optional: Add an image placeholder or task-related icon here */}
        {/* <div className="w-full h-40 bg-gray-200 group-hover:opacity-90 transition-opacity"></div> */}
        
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate group-hover:text-purple-600 transition-colors">
            {task.title || 'Untitled Task'}
          </h3>
          <p className="text-sm text-gray-600 mb-3 flex-grow line-clamp-2">
            {task.description || 'No description available.'}
          </p>
          
          <div className="mt-auto">
            <div className="flex justify-between items-center mb-2 text-xs text-gray-500">
              <span>Deadline: {formatDate(task.deadline)}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.progress || 'to-do')}`}>
                {task.progress || 'To-do'}
              </span>
            </div>
            {/* Add more details or actions here if needed, e.g., priority, assignee */}
          </div>
        </div>
      </div>
    </Link>
  );
}
