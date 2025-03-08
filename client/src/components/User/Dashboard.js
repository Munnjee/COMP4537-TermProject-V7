// client/src/components/User/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../../services/authService';
import messages from '../../utils/messages';

const UserDashboard = ({ user, setUser }) => {
  const [apiStatus, setApiStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get fresh user data
    const refreshUserData = async () => {
      try {
        const userData = await getCurrentUser();
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error('Error refreshing user data:', error);
      }
    };

    refreshUserData();
  }, [setUser]);

  useEffect(() => {
    // Set API status message based on usage
    if (user) {
      if (user.hasReachedLimit) {
        setApiStatus(messages.API_LIMIT_REACHED);
      } else if (user.apiCallsRemaining <= 5) {
        setApiStatus(messages.API_LIMIT_WARNING);
      }
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Welcome, {user.firstName}!</h1>
      
      <div className="api-usage-card">
        <h2>API Usage</h2>
        <div className="usage-stats">
          <div className="stat-item">
            <span className="stat-label">Total API Calls:</span>
            <span className="stat-value">{user.apiCallsCount}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Free API Calls Limit:</span>
            <span className="stat-value">{user.apiCallsLimit}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Remaining Free API Calls:</span>
            <span className="stat-value">{user.apiCallsRemaining}</span>
          </div>
        </div>
        
        {apiStatus && (
          <div className={`api-status ${user.hasReachedLimit ? 'error' : 'warning'}`}>
            {apiStatus}
          </div>
        )}
      </div>
      
      <div className="api-service-section">
        <h2>AI Services</h2>
        <p>Use our AI-powered services below:</p>
        <div className="services-container">
          {/* This section would contain your AI service components */}
          <div className="service-placeholder">
            <h3>AI Service 1</h3>
            <p>Description of your first AI service will go here.</p>
            <button className="service-button">Use Service</button>
          </div>
          <div className="service-placeholder">
            <h3>AI Service 2</h3>
            <p>Description of your second AI service will go here.</p>
            <button className="service-button">Use Service</button>
          </div>
        </div>
      </div>
      
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default UserDashboard;