import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';

// Helper to get ID token
const fetchUserAuthToken = async () => {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();
  if (!token) throw new Error("No ID token found");
  return token;
};

export default function TaskEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: '',
    status: '',
    attachmentUrl: '',
  });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = await fetchUserAuthToken();
        const response = await axios.get(
          `https://mye64ogig2.execute-api.eu-north-1.amazonaws.com/stage-cors/task/${id}`,
          { headers: { Authorization: token } }
        );

        const raw = response.data.task;
        const parsedTask = {
          title: raw.title?.S || '',
          description: raw.description?.S || '',
          dueDate: raw.dueDate?.S || '',
          priority: raw.priority?.S || '',
          status: raw.status?.S || '',
          attachmentUrl: raw.attachmentUrl?.S || '',
        };

        setFormData(parsedTask);
        setError(null);
      } catch (err) {
        console.error("Error fetching task for edit:", err);
        setError("Failed to load task details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTask();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const token = await fetchUserAuthToken();

      const payload = {
        task_id: id,
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate,
        priority: formData.priority,
        status: formData.status,
        attachmentUrl: formData.attachmentUrl,
      };

      await axios.put(
        `https://mye64ogig2.execute-api.eu-north-1.amazonaws.com/stage-cors/task/${id}`,
        payload,
        { headers: { Authorization: token } }
      );

      navigate(`/tasks/${id}`);
    } catch (err) {
      console.error("Error updating task:", err);
      setError("Failed to update task. Please try again.");
    }
  };

  if (loading) return <p>Loading task details for edit...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Edit Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1" htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1" htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1" htmlFor="dueDate">Due Date</label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={formData.dueDate ? formData.dueDate.split('T')[0] : ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1" htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select priority</option>
            <option value="Low">Low</option>
            <option value="Normal">Normal</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1" htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select status</option>
            <option value="To-Do">To-Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
            <option value="Canceled">Canceled</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1" htmlFor="attachmentUrl">Attachment URL</label>
          <input
            id="attachmentUrl"
            name="attachmentUrl"
            type="url"
            value={formData.attachmentUrl}
            onChange={handleChange}
            placeholder="https://example.com/file.pdf"
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="flex space-x-4 mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Save Changes
          </button>

          <Link
            to={`/tasks/${id}`}
            className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
