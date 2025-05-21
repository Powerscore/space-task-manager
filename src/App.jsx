import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from "react-oidc-context";
// import SpaceBackground from './components/SpaceBackground';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Tasks from './pages/Tasks';
import TaskDetail from './pages/TaskDetail';
import TaskEdit from './pages/TaskEdit';
import TaskCalendar from './pages/TaskCalendar';
import Profile from './pages/Profile';

function PrivateRoute({ children }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  return user ? children : <Navigate to="/login" />;
}


const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_DZFnqmc50",
  client_id: "2fa4s4knpgmclsngt7ojqeg5v0",
  redirect_uri: "http://localhost:5173",
  response_type: "code",
  scope: "aws.cognito.signin.user.admin openid email",
  loadUserInfo: true,
};

export default function App() {
  return (
    // Use a neutral background for the entire app, allowing pages to control their specific layouts
    <main className="min-h-screen bg-gray-100 text-gray-800 font-sans">
      <AuthProvider {...cognitoAuthConfig}>
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
            <Route path="/calendar" element={<PrivateRoute><TaskCalendar /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          </Routes>
          {/* Consider adding a global Footer component here */}
          {/* <Footer /> */}
        </Router>
      </AuthProvider>
    </main>
  );
}