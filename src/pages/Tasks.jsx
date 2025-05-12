import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskCard from '../components/TaskCard';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios
      .get(
        'https://mye64ogig2.execute-api.eu-north-1.amazonaws.com/task-management-deploy-stage/tasks'
      )
      .then((r) => setTasks(r.data));
  }, []);

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-purple-700 text-center w-full">Your Tasks</h2>
          <a
            href="/tasks/new"
            className="ml-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow transition-colors duration-200 text-base font-medium whitespace-nowrap"
          >
            + New Task
          </a>
        </div>
        <div className="flex flex-wrap">
          {tasks.map((t) => (
            <TaskCard key={t.task_id} task={t} />
          ))}
        </div>
      </div>
    </div>
  );
}