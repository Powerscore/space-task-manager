import React, { useState, useRef } from 'react';
import axios from 'axios'; // Assuming you might use axios for direct uploads from here

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

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setUploadError(null); // Reset error on new file selection
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select a file first.');
      return;
    }
    if (!taskId) {
      setUploadError('Task ID is missing. Cannot upload attachment.');
      // This case should ideally be handled by disabling the component or not rendering it
      // if taskId is not available.
      console.error("AttachmentDropdown: Task ID is missing.");
      return;
    }

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', selectedFile); // Key 'file' depends on your API

    try {
      // Replace with your actual API endpoint for uploading attachments
      // The endpoint might need the taskId in the URL or as part of FormData
      const response = await axios.put(
        `https://mye64ogig2.execute-api.eu-north-1.amazonaws.com/task-management-deploy-stage/task/${taskId}/attachment`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            // Add any auth headers if required by your API
          },
        }
      );
      // Assuming the API returns the new attachment details or a success message
      if (onUploadSuccess) {
        onUploadSuccess(response.data); // Pass data to parent (e.g., to update task details)
      }
      setSelectedFile(null); // Reset file input
      if(fileInputRef.current) fileInputRef.current.value = ""; // Clear the actual file input
      setIsOpen(false); // Close dropdown on success
    } catch (error) {
      console.error("Error uploading attachment:", error);
      setUploadError(error.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // This component is simplified. In a real app, you might list existing attachments too.
  return (
    <div className="relative inline-block text-left w-full md:w-auto">
      <button 
        type="button" 
        onClick={toggleDropdown} 
        className="group w-full md:w-auto flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
      >
        <PaperclipIcon />
        Manage Attachments
        {/* Dropdown Arrow Icon */}
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
                {/* Spinner Icon */}
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
