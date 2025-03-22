import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/authService';
import { getApiStats, getUserStats, verifyAdminAccess } from '../../services/adminService';
import UserManagement from './UserManagement';
import AccessDeniedAlert from './AccessDeniedAlert';
import './Dashboard.css';
import messages from '../../utils/messages';

const AdminDashboard = ({ user, setUser }) => {
  const [endpointStats, setEndpointStats] = useState([]);
  const [userStats, setUserStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('endpoints');
  const [adminAccessVerified, setAdminAccessVerified] = useState(false);
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const navigate = useNavigate();

  // Function to fetch stats from the API
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

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        await verifyAdminAccess();
        setAdminAccessVerified(true);
        fetchStats();
      } catch (err) {
        console.error('Admin access verification failed:', err);
        if (err.response && err.response.status === 403) {
          setShowAccessDenied(true);
          setLoading(false);
        }
      }
    };

    checkAdminAccess();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleRedirectToHome = () => {
    navigate('/');
  };

  if (showAccessDenied) {
    return <AccessDeniedAlert onClose={handleRedirectToHome} redirectTimeout={5} />;
  }

  if (loading) {
    return <div className="loading">{messages.LOADING}</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>{messages.ADMIN_DASHBOARD}</h1>

      <div className="admin-tabs">
        <button
          className={`tab-button ${activeTab === 'endpoints' ? 'active' : ''}`}
          onClick={() => setActiveTab('endpoints')}
        >
          {messages.ENDPOINTS_STATS}
        </button>
        <button
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          {messages.USER_API_USAGE}
        </button>
        <button
          className={`tab-button ${activeTab === 'management' ? 'active' : ''}`}
          onClick={() => setActiveTab('management')}
        >
          {messages.USER_MANAGEMENT}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="stats-container">
        {activeTab === 'endpoints' && (
          <div className="endpoints-stats">
            <h2>{messages.ENDPOINTS_STATS}</h2>
            <table className="stats-table">
              <thead>
                <tr>
                  <th>{messages.METHOD}</th>
                  <th>{messages.ENDPOINT}</th>
                  <th>{messages.REQUESTS}</th>
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
                    <td colSpan="3" className="no-data">{messages.NO_DATA}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-stats">
            <h2>{messages.USER_API_USAGE}</h2>
            <table className="stats-table">
              <thead>
                <tr>
                  <th>{messages.USER_NAME}</th>
                  <th>{messages.EMAIL}</th>
                  <th>{messages.TOTAL_REQUESTS}</th>
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
                    <td colSpan="3" className="no-data">{messages.NO_DATA}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'management' && (
          <UserManagement onUserUpdated={fetchStats} />
        )}
      </div>

      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default AdminDashboard;