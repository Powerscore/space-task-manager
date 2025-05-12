/* eslint-disable no-unused-vars */
import React from "react";
export default function AttachmentDropdown({ onUpload }) {
  const handleFile = async (e) => {
    const file = e.target.files[0];
    // upload logic via Amplify Storage or presigned URL then call onUpload(url)
  };
  return (
    <div className="relative inline-block text-left">
      <button className="flex items-center px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg shadow-sm focus:outline-none">
        Attachments
        {/* ...icon or arrow... */}
      </button>
      {/* ...dropdown content... */}
    </div>
  );
}
