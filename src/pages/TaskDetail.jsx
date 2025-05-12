import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    axios.get(`https://mye64ogig2.execute-api.eu-north-1.amazonaws.com/task-management-deploy-stage/task/${id}`)
      .then(r => setTask(r.data));
  }, [id]);

  if (!task) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-2xl p-8 bg-white rounded-xl shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-purple-700">Task Details</h2>
        <h2 className="text-3xl">{task.title}</h2>
        <p>{task.description}</p>
        <p>Status: {task.progress}</p>
        <Link to={`/tasks/${id}/edit`} className="mt-4 px-4 py-2 bg-spacePink rounded inline-block">Edit</Link>
      </div>
    </div>
  );
}