import React from "react";
import { Link } from "react-router-dom";
export default function TaskCard({ task }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-4 flex flex-col gap-2 border border-purple-100 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-purple-700">{task.title}</h3>
      </div>
      <p className="text-gray-600">{task.description}</p>
    </div>
  );
}
