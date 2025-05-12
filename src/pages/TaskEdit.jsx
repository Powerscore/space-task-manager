import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TaskForm from '../components/TaskForm';

export default function TaskEdit({ isNew }) {
  const { id } = useParams();
  const nav = useNavigate();

  const handleSave = data => {
    if (isNew) {
      axios.post('https://mye64ogig2.execute-api.eu-north-1.amazonaws.com/task-management-deploy-stage/task', data)
        .then(res => nav(`/tasks/${res.data.id || ''}`));
    } else {
      axios.patch(`https://mye64ogig2.execute-api.eu-north-1.amazonaws.com/task-management-deploy-stage/task/${id}`, data)
        .then(() => nav(`/tasks/${id}`));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-2xl p-8 bg-white rounded-xl shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-purple-700">{isNew ? 'Create Task' : 'Edit Task'}</h2>
        <TaskForm onSave={handleSave} />
      </div>
    </div>
  );
}