/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import AttachmentDropdown from "./AttachmentDropdown";
export default function TaskForm({ initial = {}, onSave, formTitle }) {
  const [title, setTitle] = useState(initial.title || "");
  const [desc, setDesc] = useState(initial.description || "");
  const [progress, setProgress] = useState(initial.progress || "to-do");
  const [deadline, setDeadline] = useState(initial.deadline || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, description: desc, progress, deadline });
  };

  return (
    <form className="bg-white rounded-xl shadow-md p-8 flex flex-col gap-4 max-w-lg mx-auto border border-purple-100" onSubmit={handleSubmit}>
      <h3 className="text-2xl font-bold text-purple-700 mb-4">{formTitle || 'Task Form'}</h3>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full p-2 mb-2 rounded" />
      <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description" className="w-full p-2 mb-2 rounded"></textarea>
      <select value={progress} onChange={(e) => setProgress(e.target.value)} className="w-full p-2 mb-2 rounded">
        <option value="to-do">To-do</option>
        <option value="in progress">In Progress</option>
        <option value="done">Done</option>
        <option value="canceled">Canceled</option>
      </select>
      <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full p-2 mb-2 rounded" />
      <AttachmentDropdown
        onUpload={(url) => {
          /* handle url array update */
        }}
      />
      <button type="submit" className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow transition-colors duration-200 text-base font-medium">
        Save
      </button>
    </form>
  );
}
