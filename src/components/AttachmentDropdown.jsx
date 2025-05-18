import React, { useState, useRef } from 'react'; // Added React import
import axios from 'axios';
import { useAuth } from 'react-oidc-context'; // Import useAuth

// Simple Plus Icon
const PlusIcon = () => (
  <svg className="w-4 h-4 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M12 4v16m8-8H4"></path>
  </svg>
);

// Simple Paperclip Icon
const PaperclipIcon = () => (
  <svg className="w-4 h-4 mr-2 text-gray-500 group-hover:text-purple-600 transition-colors" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"></path>
  </svg>
);

export default function AttachmentDropdown({ taskId, onUploadSuccess }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);
  const auth = useAuth(); // Get auth context

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setUploadError(null); // Clear previous errors
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError("Please select a file first.");
      return;
    }
    if (!auth.isAuthenticated || !auth.user?.id_token) {
      setUploadError("You must be signed in to upload files.");
      alert("Authentication error. Please sign in again.");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const token = auth.user.id_token;
      const filename = selectedFile.name;
      const presignEndpoint = `https://mye64ogig2.execute-api.eu-north-1.amazonaws.com/stage-cors/task/${taskId}/attachments`;

      // 1. Get pre-signed URL from your backend
      const { data: presignResponse } = await axios.put(presignEndpoint, null, {
        headers: { Authorization: `Bearer ${token}` },
        params: { key: filename }, 
      });

      if (!presignResponse.uploadUrl) {
        throw new Error("Could not retrieve an upload URL.");
      }

      // 2. Upload the file to S3 using the pre-signed URL
      await fetch(presignResponse.uploadUrl, {
        method: 'PUT',
        body: selectedFile,
        headers: {
          'Content-Type': selectedFile.type || 'application/octet-stream',
        },
      });
      
      // 3. (Optional but recommended) Update task with new attachment key via PATCH
      const patchPayload = { attachmentUrl: filename }; // Or whatever key your backend expects
      await axios.patch(
        `https://mye64ogig2.execute-api.eu-north-1.amazonaws.com/stage-cors/task/${taskId}`,
        patchPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSelectedFile(null); // Clear selection
      setIsOpen(false); // Close dropdown
      if (onUploadSuccess) {
        onUploadSuccess(filename); // Notify parent component
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setUploadError(err.response?.data?.message || err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative inline-block text-left w-full md:w-auto">
      <button 
        type="button" 
        onClick={toggleDropdown} 
        className="group w-full md:w-auto flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
      >
        <PaperclipIcon />
        Manage Attachments
        <svg className={`w-4 h-4 ml-2 transition-transform ${isOpen ? '-rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div 
          className="origin-top-right absolute right-0 mt-2 w-72 rounded-md shadow-xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 p-4 space-y-3"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="text-sm font-semibold text-gray-800 mb-2">Upload New Attachment</div>
          
          {uploadError && (
            <p className="text-xs text-red-600 bg-red-50 p-2 rounded-md">{uploadError}</p>
          )}

          <div>
            <label htmlFor="file-upload" className="sr-only">Choose file</label>
            <input 
              id="file-upload"
              ref={fileInputRef}
              type="file" 
              onChange={handleFileChange} 
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 transition-colors" 
            />
          </div>

          {selectedFile && (
            <div className="text-xs text-gray-600 truncate">Selected: {selectedFile.name}</div>
          )}

          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading || !selectedFile}
            className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <PlusIcon /> Upload File
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
