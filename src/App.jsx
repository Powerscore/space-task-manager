import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';

// import SpaceBackground from './components/SpaceBackground';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Tasks from './pages/Tasks';
import TaskDetail from './pages/TaskDetail';
import TaskEdit from './pages/TaskEdit';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    // Use a neutral background for the entire app, allowing pages to control their specific layouts
    <main className="min-h-screen bg-gray-100 text-gray-800 font-sans">
      <AuthProvider>
        <Router>
          {/* Consider adding a global Navbar/Header component here for consistent navigation */}
          {/* <Navbar /> */}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/tasks" element={<PrivateRoute><Tasks /></PrivateRoute>} />
            <Route path="/tasks/:id" element={<PrivateRoute><TaskDetail /></PrivateRoute>} />
            <Route path="/tasks/:id/edit" element={<PrivateRoute><TaskEdit isNew={false} /></PrivateRoute>} />
            <Route path="/tasks/new" element={<PrivateRoute><TaskEdit isNew={true} /></PrivateRoute>} />
          </Routes>
          {/* Consider adding a global Footer component here */}
          {/* <Footer /> */}
        </Router>
      </AuthProvider>
    </main>
  );
}