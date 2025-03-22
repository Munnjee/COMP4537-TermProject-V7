import React, { useState, useEffect } from 'react';
import { getUsers, updateUserRole } from '../../services/adminService';
import messages from '../../utils/messages';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      setUsers(response.data);
      setError('');
    } catch (err) {
      setError(err.message || 'Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === 'user' ? 'admin' : 'user';

    try {
      const response = await updateUserRole(userId, newRole);
      setUsers(users.map(user =>
        user._id === userId ? { ...user, role: newRole } : user
      ));
      setSuccessMessage(`${messages.ROLE_UPDATED} to ${newRole} successfully!`);
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

    } catch (err) {
      setError(err.message || messages.ERROR_UPDATING_ROLE);
      setTimeout(() => {
        setError('');
      }, 3000);
    }
};

  if (loading) {
    return <div className="loading">{messages.LOADING}</div>;
  }

  return (
    <div className="user-management">
      <h2>{messages.USER_MANAGEMENT}</h2>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <table className="stats-table">
        <thead>
          <tr>
            <th>{messages.USER_NAME}</th>
            <th>{messages.EMAIL}</th>
            <th>{messages.ROLE}</th>
            <th>{messages.API_CALLS}</th>
            <th>{messages.ACTION}</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.firstName}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td>{user.apiCallsCount}</td>
                <td>
                  <button
                    className={`role-button ${user.role === 'user' ? 'promote' : 'demote'}`}
                    onClick={() => handleRoleChange(user._id, user.role)}
                  >
                    {user.role === 'user' ? messages.MAKE_ADMIN : messages.MAKE_USER}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-data">{messages.NO_DATA}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;

// Attribution: ChatGPT was used for structure and organization of the code and Copilot was used to assist in writing the code.