import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import TaskForm from '../components/TaskForm';
import { useAuth } from '../AuthContext';
import { fetchAuthSession } from '@aws-amplify/auth';
import { useDropzone } from 'react-dropzone';

const fetchUserAuthToken = async () => {
  console.log('[LOG] fetchUserAuthToken: start');
  const session = await fetchAuthSession();
  console.log('[LOG] fetchAuthSession result:', session);
  const token = session?.tokens?.idToken?.toString();
  console.log('[LOG] extracted token:', token);
  if (!token) {
    console.error('[ERROR] fetchUserAuthToken: No ID token found');
    throw new Error("No ID token found");
  }
  console.log('[LOG] fetchUserAuthToken: end');
  return token;
};

export default function TaskEdit({ isNew }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    console.log('[LOG] onDrop:', acceptedFiles);
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      console.log('[LOG] file set:', acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    const fetchTask = async () => {
      console.log('[LOG] fetchTask: start', { isNew, id });
      try {
        const token = await fetchUserAuthToken();
        console.log('[LOG] fetchTask: token acquired');
        const response = await axios.get(
          `https://mye64ogig2.execute-api.eu-north-1.amazonaws.com/stage-cors/task/${id}`,
          { headers: { Authorization: token } }
        );
        console.log('[LOG] fetchTask: response.data:', response.data);

        const raw = response.data;
        const unwrapped = {
          id: raw.task_id?.S,
          title: raw.title?.S,
          description: raw.description?.S,
          dueDate: raw.dueDate?.S,
          priority: raw.priority?.S,
          status: raw.status?.S,
          attachmentUrl: raw.attachmentUrl?.S,
        };
        console.log('[LOG] fetchTask: unwrapped:', unwrapped);

        setInitialData(unwrapped);
        setError(null);
      } catch (err) {
        console.error('[ERROR] fetchTask:', err);
        setError("Failed to load task. Try again.");
      } finally {
        console.log('[LOG] fetchTask: end');
        setLoading(false);
      }
    };

    if (!isNew && id) {
      fetchTask();
    }
  }, [id, isNew]);

  const handleSave = async (data) => {
    console.log('[LOG] handleSave: start', { data, isNew, id, file });
    try {
      const token = await fetchUserAuthToken();
      console.log('[LOG] handleSave: token:', token);

      let taskId = id;
      const urlBase = 'https://mye64ogig2.execute-api.eu-north-1.amazonaws.com/stage-cors/task';

      if (isNew) {
        console.log('[LOG] handleSave: creating new task first');
        const resp = await axios.post(urlBase, data, { headers: { Authorization: token } });
        console.log('[LOG] handleSave: create response:', resp.data);
        taskId = resp.data.id;
      }

      let attachmentUrl = data.attachmentUrl || '';
      if (file) {
        const filename = file.name;
        console.log('[LOG] handleSave: file present, filename:', filename);
        const presignUrl = `${urlBase}/${taskId}/attachments`;
        console.log('[LOG] handleSave: presign endpoint:', presignUrl);

        const presignResp = await axios.get(presignUrl, {
          headers: { Authorization: token },
          params: { key: filename }
        });
        console.log('[LOG] handleSave: presign response:', presignResp.data);

        const uploadResp = await fetch(presignResp.data.downloadUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type || 'application/octet-stream'
          }
        });
        console.log('[LOG] handleSave: S3 upload response status:', uploadResp.status);

        if (!uploadResp.ok) {
          throw new Error(`File upload failed with status ${uploadResp.status}`);
        }

        attachmentUrl = `${taskId}/${filename}`;
        console.log('[LOG] handleSave: attachmentUrl set to', attachmentUrl);
      }

      const payload = {
        ...data,
        title: data.title?.trim(),
        dueDate: data.dueDate,
        priority: data.priority || 'Medium',
        status: data.status || 'Not Started',
        attachmentUrl,
      };
      console.log('[LOG] handleSave: payload for final save:', payload);

      const saveUrl = `${urlBase}/${taskId}`;
      console.log('[LOG] handleSave: final PATCH to', saveUrl);

      const saveResp = await axios.patch(saveUrl, payload, { headers: { Authorization: token } });
      console.log('[LOG] handleSave: save response:', saveResp.data);

      navigate(`/tasks/${taskId}`);
    } catch (err) {
      console.error('[ERROR] handleSave:', err);
      alert(`Failed to save task: ${err.message || 'Unknown error'}`);
    } finally {
      console.log('[LOG] handleSave: end');
    }
  };

  if (loading) {
    console.log('[LOG] rendering loading state');
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading task for editing...</p>
      </div>
    );
  }

  if (error && !isNew) {
    console.log('[LOG] rendering error state:', error);
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-lg text-red-600">{error}</p>
        <Link to="/tasks" className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg">
          Back to Tasks
        </Link>
      </div>
    );
  }

  console.log('[LOG] rendering form with initialData:', initialData);

  const formInitialData = {
    ...initialData,
    attachmentUrl: file ? file.name : initialData?.attachmentUrl || '',
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      <header className="py-4 px-6 md:px-12 bg-white shadow-sm sticky top-0 border-b border-gray-200 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-purple-600">SpaceTaskManager</Link>
          <nav className="flex items-center space-x-4">
            <Link to="/tasks" className="text-gray-600 hover:text-purple-600 font-medium">
              My Tasks
            </Link>
            {user && (
              <button
                onClick={signOut}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium"
              >
                Sign Out
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow-lg border space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center">
            {isNew ? 'Create New Task' : 'Edit Task'}
          </h1>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed p-6 rounded-lg text-center ${
              isDragActive ? 'border-purple-400 bg-purple-50' : 'border-gray-300 bg-white'
            }`}
          >
            <input {...getInputProps()} />
            {file ? (
              <p className="text-gray-800">Selected file: <strong>{file.name}</strong></p>
            ) : (
              <p className="text-gray-500">Drag & drop a file here, or click to select</p>
            )}
          </div>

          <TaskForm
            initialData={formInitialData}
            onSave={handleSave}
            isNew={isNew}
          />
        </div>
      </main>
    </div>
  );
}
