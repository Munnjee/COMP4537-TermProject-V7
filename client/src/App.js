import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getCurrentUser } from './services/authService';

// Components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import UserDashboard from './components/User/Dashboard';
import AdminDashboard from './components/Admin/Dashboard';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// CSS
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for logged in user
    const checkUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  if (loading) {
    return <div className="loading-app">Loading...</div>;
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} />
              ) : (
                <Login setUser={setUser} />
              )
            }
          />
          <Route
            path="/register"
            element={
              user ? (
                <Navigate to="/dashboard" />
              ) : (
                <Register setUser={setUser} />
              )
            }
          />
          <Route
            path="/forgot-password"
            element={
              user ? (
                <Navigate to="/dashboard" />
              ) : (
                <ForgotPassword />
              )
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              user ? (
                <Navigate to="/dashboard" />
              ) : (
                <ResetPassword />
              )
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute user={user}>
                <UserDashboard user={user} setUser={setUser} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute user={user} adminOnly={true}>
                <AdminDashboard user={user} setUser={setUser} />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route
            path="/"
            element={
              user ? (
                <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;