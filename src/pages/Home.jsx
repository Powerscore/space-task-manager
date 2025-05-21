import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';// Assuming AuthContext is in src/

export default function Home() {
  const { user, signOut } = useAuth();

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Header/Navigation Area - Simplified for now */}
      <header className="py-4 px-6 md:px-12 shadow-sm border-b border-gray-200">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-purple-600">
            SpaceTaskManager
          </Link>
          <nav className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/tasks" className="text-gray-600 hover:text-purple-600 font-medium">My Tasks</Link>
                <Link to="/calendar" className="text-gray-600 hover:text-purple-600 font-medium">Calendar</Link>
                <Link to="/profile" className="text-gray-600 hover:text-purple-600 font-medium">Profile</Link>
                <button 
                  onClick={signOut} 
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-purple-600 font-medium">Login</Link>
                <Link 
                  to="/signup" 
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 mb-6 leading-tight">
            Organize Your Universe, One Task at a Time.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Space Task Manager helps you conquer your daily missions with clarity and focus. 
            Streamline your workflow, collaborate seamlessly, and reach your goals faster than light speed.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/tasks"
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md text-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              View My Tasks
            </Link>
            {!user && (
              <Link
                to="/signup"
                className="px-8 py-3 bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-50 rounded-lg shadow-md text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Get Started Free
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section (Example) */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-purple-700 mb-3">Intuitive Design</h3>
              <p className="text-gray-600">A clean, Airbnb-inspired interface that's easy to navigate and a joy to use.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-purple-700 mb-3">Powerful Features</h3>
              <p className="text-gray-600">Manage deadlines, track progress, and organize attachments effortlessly.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-purple-700 mb-3">Seamless Collaboration</h3>
              <p className="text-gray-600">(Future) Share tasks and projects with your team members.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-800 text-gray-400 text-center">
        <div className="container mx-auto px-6">
          <p>&copy; {new Date().getFullYear()} Space Task Manager. Inspired by the stars, built for you.</p>
        </div>
      </footer>
    </div>
  );
}