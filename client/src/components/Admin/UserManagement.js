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
    // If the current role is 'user', change to 'admin', otherwise change to 'user'
    const newRole = currentRole === 'user' ? 'admin' : 'user';
    
    try {
      // Optimistic UI update
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
      
      setSuccessMessage(`Updating user role to ${newRole}...`);
      
      // Call API to update role
      const response = await updateUserRole(userId, newRole);
      
      // Show success message
      setSuccessMessage(`User role updated to ${newRole} successfully!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
    } catch (err) {
      // Revert optimistic update
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: currentRole } : user
      ));
      
      setError(err.message || 'Error updating user role');
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="user-management">
      <h2>User Management</h2>
      
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <table className="stats-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>API Calls</th>
            <th>Actions</th>
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
                    {user.role === 'user' ? 'Make Admin' : 'Make User'}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-data">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;