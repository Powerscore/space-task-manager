import React, { useState, useEffect } from "react";
import AttachmentDropdown from "./AttachmentDropdown";

export default function TaskForm({ initialData = {}, onSave, isNew }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [progress, setProgress] = useState('to-do');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setProgress(initialData.progress || 'to-do');
      setDeadline(initialData.deadline ? new Date(initialData.deadline).toISOString().substring(0, 16) : '');
    } else {
      setTitle('');
      setDescription('');
      setProgress('to-do');
      setDeadline('');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, description, progress, deadline });
  };

  const inputClasses = "w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title" className={labelClasses}>Title</label>
        <input 
          id="title"
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Enter task title"
          required 
          className={inputClasses} 
        />
      </div>

      <div>
        <label htmlFor="description" className={labelClasses}>Description</label>
        <textarea 
          id="description"
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Enter task description"
          rows="4" 
          className={`${inputClasses} min-h-[100px]`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="progress" className={labelClasses}>Status</label>
          <select 
            id="progress"
            value={progress} 
            onChange={(e) => setProgress(e.target.value)} 
            className={inputClasses}
          >
            <option value="to-do">To-do</option>
            <option value="in progress">In Progress</option>
            <option value="done">Done</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
        <div>
          <label htmlFor="deadline" className={labelClasses}>Deadline</label>
          <input 
            id="deadline"
            type="datetime-local" 
            value={deadline} 
            onChange={(e) => setDeadline(e.target.value)} 
            className={inputClasses} 
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button 
          type="button" 
          onClick={() => window.history.back()}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md font-medium transition-colors transform hover:scale-105"
        >
          {isNew ? 'Create Task' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
