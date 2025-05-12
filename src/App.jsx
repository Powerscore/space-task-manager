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
    <main className="flex justify-center min-w-screen items-center min-h-screen bg-gradient-to-r from-purple-500 to-blue-500">

    
    <AuthProvider>
      {/* <SpaceBackground> */}
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/tasks" element={<PrivateRoute><Tasks /></PrivateRoute>} />
            <Route path="/tasks/:id" element={<PrivateRoute><TaskDetail /></PrivateRoute>} />
            <Route path="/tasks/:id/edit" element={<PrivateRoute><TaskEdit /></PrivateRoute>} />
            <Route path="/tasks/new" element={<PrivateRoute><TaskEdit isNew /></PrivateRoute>} />
          </Routes>
        </Router>
      {/* </SpaceBackground> */}
    </AuthProvider>
    </main>
  );
}