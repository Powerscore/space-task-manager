import React, { useState, useEffect } from "react";
import AttachmentDropdown from "./AttachmentDropdown";

export default function TaskForm({ initialData = {}, onSave, isNew }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("To-do");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    console.log("💡 [TaskForm] initialData changed:", initialData);
    if (initialData && Object.keys(initialData).length > 0) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setStatus(initialData.status || "To-do");
      setPriority(initialData.priority || "Medium");
      setDueDate(
        initialData.dueDate
          ? new Date(initialData.dueDate).toISOString().substring(0, 16)
          : ""
      );
    } else {
      setTitle("");
      setDescription("");
      setStatus("To-do");
      setPriority("Medium");
      setDueDate("");
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("💡 [TaskForm] about to call onSave with:", e);
    onSave({ title, description, status, priority, dueDate });
  };

  const inputClasses =
    "w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title" className={labelClasses}>
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          required={isNew}
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="description" className={labelClasses}>
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
          rows="4"
          required={isNew}
          className={`${inputClasses} min-h-[100px]`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="status" className={labelClasses}>
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={inputClasses}
          >
            <option value="To-do">To-do</option>
            <option value="In progress">In Progress</option>
            <option value="Done">Done</option>
            <option value="Canceled">Canceled</option>
          </select>
        </div>

        <div>
          <label htmlFor="priority" className={labelClasses}>
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className={inputClasses}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div>
          <label htmlFor="dueDate" className={labelClasses}>
            Due Date
          </label>
          <input
            id="dueDate"
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required={isNew}
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
