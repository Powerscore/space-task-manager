import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "react-oidc-context";
import axios from "axios";
import { useDropzone } from "react-dropzone";

export default function Profile() {
  const auth = useAuth();
  const [createdAt, setCreatedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const apiBase = "https://mye64ogig2.execute-api.eu-north-1.amazonaws.com/stage-cors";
  const email = auth.user?.profile?.email;
  const userID = auth.user?.profile?.sub
    ? encodeURIComponent(auth.user.profile.email)
    : "";
  const onDrop = useCallback((files) => {
    if (files.length > 0) setFile(files[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    if (!auth.isAuthenticated) return;
    const iat = null;
    if (iat) setCreatedAt(new Date(iat).toISOString());
    console.log("iat", iat);
    console.log("createdAt", createdAt);
  }, [auth]);

  useEffect(() => {
    if (!auth.isAuthenticated || !auth.user.id_token) {
      setLoading(false);
      return;
    }
    const fetchImage = async () => {
      try {
        const resp = await axios.get(
          `${apiBase}/task/${userID}/attachments`,
          {
            headers: { Authorization: `Bearer ${auth.user.id_token}` },
            params: { key: email },
          }
        );
        setImageUrl(resp.data.downloadUrl || resp.data.uploadUrl);
      } catch {
        // no image yet
      } finally {
        setLoading(false);
      }
    };
    fetchImage();
  }, [auth, email]);

  const handleUpload = async () => {
    if (!file || !auth.user.id_token) return;
    setError(null);
    setUploading(true);
    try {
      const { data: uploadResp } = await axios.put(
        `${apiBase}/task/${userID}/attachments`,
        null,
        {
          headers: { Authorization: `Bearer ${auth.user.id_token}` },
          params: { key: email },
        }
      );

      await fetch(uploadResp.uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type || "application/octet-stream" },
      });

      const { data: getResp } = await axios.get(
        `${apiBase}/task/${userID}/attachments`,
        {
          headers: { Authorization: `Bearer ${auth.user.id_token}` },
          params: { key: email },
        }
      );
      setImageUrl(getResp.downloadUrl || getResp.uploadUrl);
      setFile(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setUploading(false);
    }
  };

  if (auth.isLoading || loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-500"></div>
      </div>
    );
  }

  const name = auth.user.profile.name || email;

  return (
    <div className="bg-gradient-to-br from-purple-100 to-white min-h-screen flex items-center justify-center py-12 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full space-y-8">
        <h1 className="text-3xl font-extrabold text-center text-gray-800">Your Profile</h1>

        <div className="flex justify-center">
          <div className="relative">
            <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-purple-400 to-indigo-600 p-1">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover bg-white"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          {...getRootProps({ disabled: uploading })}
          className={`transition-colors duration-200 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
            ${isDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 bg-gray-50'}`}
        >
          <input {...getInputProps()} disabled={uploading} />
          {file ? (
            <p className="text-gray-700">
              Selected: <span className="font-medium">{file.name}</span>
            </p>
          ) : (
            <p className="text-gray-500">Drag & drop to change picture, or click to browse</p>
          )}
        </div>

        {file && (
          uploading ? (
            <div className="flex justify-center py-3">
              <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-purple-600"></div>
            </div>
          ) : (
            <button
              onClick={handleUpload}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all duration-150"
            >
              Upload New Picture
            </button>
          )
        )}

        {error && <p className="text-red-600 text-center">{error}</p>}

        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <p className="text-gray-700">
            <span className="font-semibold">Email:</span> {email}
          </p>
          {createdAt && (
            <p className="text-gray-700">
              <span className="font-semibold">Member since:</span> {new Date(createdAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
