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

  // Function to fetch endpoint stats
  const fetchEndpointStats = async () => {
    try {
      setLoading(true);
      const endpointRes = await getApiStats();
      setEndpointStats(endpointRes.data);
      setError('');
    } catch (err) {
      console.error('Error fetching endpoint stats:', err);
      setError(messages.SERVER_ERROR);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch user stats
  const fetchUserStats = async () => {
    try {
      setLoading(true);
      const userRes = await getUserStats();
      setUserStats(userRes.data);
      setError('');
    } catch (err) {
      console.error('Error fetching user stats:', err);
      setError(messages.SERVER_ERROR);
    } finally {
      setLoading(false);
    }
  };

  // Initial setup and admin access verification
  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        await verifyAdminAccess();
        setAdminAccessVerified(true);
        // Load initial data for the first tab
        fetchEndpointStats();
      } catch (err) {
        console.error('Admin access verification failed:', err);
        if (err.response && err.response.status === 403) {
          setShowAccessDenied(true);
          setLoading(false);
        }
      }
    };

    checkAdminAccess();
  }, []);

  // Fetch data when tab changes
  useEffect(() => {
    if (!adminAccessVerified) return;
    
    if (activeTab === 'endpoints') {
      fetchEndpointStats();
    } else if (activeTab === 'users') {
      fetchUserStats();
    }
    // No fetch needed for 'management' tab as it handles its own data
  }, [activeTab, adminAccessVerified]);

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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (showAccessDenied) {
    return <AccessDeniedAlert onClose={handleRedirectToHome} redirectTimeout={5} />;
  }

  if (loading && !activeTab) {
    return <div className="loading">{messages.LOADING}</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>{messages.ADMIN_DASHBOARD}</h1>

      <div className="admin-tabs">
        <button
          className={`tab-button ${activeTab === 'endpoints' ? 'active' : ''}`}
          onClick={() => handleTabChange('endpoints')}
        >
          {messages.ENDPOINTS_STATS}
        </button>
        <button
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => handleTabChange('users')}
        >
          {messages.USER_API_USAGE}
        </button>
        <button
          className={`tab-button ${activeTab === 'management' ? 'active' : ''}`}
          onClick={() => handleTabChange('management')}
        >
          {messages.USER_MANAGEMENT}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="stats-container">
        {activeTab === 'endpoints' && (
          <div className="endpoints-stats">
            <h2>{messages.ENDPOINTS_STATS}</h2>
            {loading ? (
              <div className="loading-message">{messages.LOADING}</div>
            ) : (
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
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-stats">
            <h2>{messages.USER_API_USAGE}</h2>
            {loading ? (
              <div className="loading-message">{messages.LOADING}</div>
            ) : (
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
            )}
          </div>
        )}

        {activeTab === 'management' && (
          <UserManagement onUserUpdated={() => {
            // Refresh user stats when user management actions occur
            fetchUserStats();
          }} />
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