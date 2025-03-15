import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/authService';
import { getApiStats, getUserStats } from '../../services/adminService';
import UserManagement from './UserManagement';
import messages from '../../utils/messages';

const AdminDashboard = ({ user, setUser }) => {
  const [endpointStats, setEndpointStats] = useState([]);
  const [userStats, setUserStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('endpoints');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [endpointRes, userRes] = await Promise.all([
          getApiStats(),
          getUserStats()
        ]);
        
        setEndpointStats(endpointRes.data);
        setUserStats(userRes.data);
        setError('');
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError(messages.SERVER_ERROR);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading statistics...</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === 'endpoints' ? 'active' : ''}`}
          onClick={() => setActiveTab('endpoints')}
        >
          API Endpoints Stats
        </button>
        <button 
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          User API Usage
        </button>
        <button 
          className={`tab-button ${activeTab === 'management' ? 'active' : ''}`}
          onClick={() => setActiveTab('management')}
        >
          User Management
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="stats-container">
        {activeTab === 'endpoints' && (
          <div className="endpoints-stats">
            <h2>API Endpoints Usage</h2>
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Method</th>
                  <th>Endpoint</th>
                  <th>Requests</th>
                </tr>
              </thead>
              <tbody>
                {endpointStats.length > 0 ? (
                  endpointStats.map((stat, index) => (
                    <tr key={index}>
                      <td>{stat.method}</td>
                      <td>{stat.endpoint}</td>
                      <td>{stat.requestCount}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="no-data">No endpoint data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'users' && (
          <div className="users-stats">
            <h2>User API Usage</h2>
            <table className="stats-table">
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Total Requests</th>
                </tr>
              </thead>
              <tbody>
                {userStats.length > 0 ? (
                  userStats.map((user, index) => (
                    <tr key={index}>
                      <td>{user.firstName}</td>
                      <td>{user.email}</td>
                      <td>{user.totalRequests}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="no-data">No user data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'management' && (
          <UserManagement />
        )}
      </div>
      
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default AdminDashboard;

// Attribution: ChatGPT was used for structure and organization of the code and Copilot was used to assist in writing the code.