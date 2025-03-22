import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { getCurrentUser } from './services/authService';

// Components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import UserHomepage from './components/User/Homepage';
import AdminDashboard from './components/Admin/Dashboard';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Game from './components/User/Game';
import NotFound from './components/Common/NotFound';
import RouteChecker from './components/Common/RouteChecker';
import messages from './utils/messages';


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
    return <div className='loading-app'>{messages.LOADING}</div>;
  }

  return (
    <Router>
      <div className='app'>
        <Routes>
          {/* Public Routes */}
          <Route
            path='/login'
            element={
              user ? (
                <Navigate
                  to={user.role === 'admin' ? '/admin/dashboard' : '/'}
                />
              ) : (
                <Login setUser={setUser} />
              )
            }
          />
          <Route
            path='/register'
            element={
              user ? <Navigate to='/' /> : <Register setUser={setUser} />
            }
          />
          <Route
            path='/forgot-password'
            element={user ? <Navigate to='/' /> : <ForgotPassword />}
          />
          <Route
            path='/reset-password/:token'
            element={user ? <Navigate to='/' /> : <ResetPassword />}
          />

          {/* Protected Routes */}
          <Route
            path='/'
            element={
              <ProtectedRoute user={user}>
                <UserHomepage user={user} setUser={setUser} />
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/dashboard'
            element={
              <ProtectedRoute user={user}>
                <AdminDashboard user={user} setUser={setUser} />
              </ProtectedRoute>
            }
          />
          <Route
            path='/game'
            element={
              <ProtectedRoute user={user}>
                <Game />
              </ProtectedRoute>
            }
          />

          {/* 404 Route - Explicit Not Found Page */}
          <Route path='/404' element={<NotFound />} />

          {/* Default Route - Check if it exists on backend, otherwise show 404 */}
          <Route path='*' element={<RouteChecker user={user} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

// Attribution: ChatGPT was used for structure and organization of the code and Copilot was used to assist in writing the code.