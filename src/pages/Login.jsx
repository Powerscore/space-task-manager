import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';

export default function Login() {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (auth.error) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <div className="text-red-600">Error during authentication: {auth.error.message}</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center">
      <header className="w-full py-4 px-6 md:px-12 border-b border-gray-200 bg-white">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-purple-600">
            SpaceTaskManager
          </Link>
        </div>
      </header>

      <main className="flex-grow container mx-auto flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 p-10 bg-white rounded-xl shadow-lg border border-gray-200">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <div className="mt-8 space-y-6">
            <div>
              <button
                onClick={() => auth.signinRedirect()}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
              >
                Sign in
              </button>
            </div>
            <div className="text-sm text-center">
              <Link to="/signup" className="font-medium text-purple-600 hover:text-purple-500">
                Don&apos;t have an account? Sign up
              </Link>
            </div>
          </div>
        </div>
      </main>
      <footer className="w-full py-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Space Task Manager
      </footer>
    </div>
  );
}