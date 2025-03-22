import React, { useState, useEffect } from 'react';
import { getUsers, updateUserRole, deleteUsers } from '../../services/adminService';
import { getCurrentUser } from '../../services/authService';
import messages from '../../utils/messages';
import './UserManagement.css';

const UserManagement = ({ onUserUpdated }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Get the current user ID
        const userData = await getCurrentUser();
        setCurrentUser(userData.id);

        // Fetch all users
        await fetchUsers();
      } catch (error) {
        console.error('Error initializing:', error);
        setError('Error loading user data');
      }
    };

    initialize();
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
      await updateUserRole(userId, newRole);
      setUsers(users.map(user =>
        user._id === userId ? { ...user, role: newRole } : user
      ));
      setSuccessMessage(`${messages.ROLE_UPDATED} ${newRole} successfully!`);

      // Call the callback to update dashboard stats
      if (onUserUpdated) {
        onUserUpdated();
      }

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

  const handleCheckboxChange = (userId) => {
    setSelectedUsers(prevSelected => {
      if (prevSelected.includes(userId)) {
        return prevSelected.filter(id => id !== userId);
      } else {
        return [...prevSelected, userId];
      }
    });
  };

  const handleDeleteSelected = async () => {
    if (selectedUsers.length === 0) {
      setError(messages.NO_USERS_SELECTED);
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      await deleteUsers(selectedUsers);
      // Remove deleted users from state
      setUsers(users.filter(user => !selectedUsers.includes(user._id)));
      setSuccessMessage(`Successfully deleted ${selectedUsers.length} user(s)`);

      // Call the callback to update dashboard stats
      if (onUserUpdated) {
        onUserUpdated();
      }

      // Reset selections
      setSelectedUsers([]);
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Error deleting users');
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  // Get the list of selectable users (exclude current user)
  const selectableUsers = users.filter(user => user._id !== currentUser).map(user => user._id);

  if (loading) {
    return <div className="loading">{messages.LOADING}</div>;
  }

  return (
    <div className="user-management">
      <h2>{messages.USER_MANAGEMENT}</h2>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      {selectedUsers.length > 0 && (
        <div className="delete-controls">
          <button
            className="delete-button"
            onClick={handleDeleteSelected}
          >
            Delete Selected ({selectedUsers.length})
          </button>
        </div>
      )}

      <table className="stats-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={() => {
                  // Check if all selectable users are selected
                  const allSelected = selectableUsers.length > 0 &&
                    selectableUsers.every(id => selectedUsers.includes(id));

                  if (allSelected) {
                    setSelectedUsers([]);
                  } else {
                    setSelectedUsers(selectableUsers);
                  }
                }}
                checked={
                  selectableUsers.length > 0 &&
                  selectableUsers.every(id => selectedUsers.includes(id))
                }
                disabled={selectableUsers.length === 0}
              />
            </th>
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
              <tr key={user._id} className={selectedUsers.includes(user._id) ? 'delete-selected' : ''}>
                <td>
                  {user._id === currentUser ? (
                    <span className="current-user-indicator" title="Current user">👤</span>
                  ) : (
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleCheckboxChange(user._id)}
                    />
                  )}
                </td>
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
                    disabled={user._id === currentUser}
                  >
                    {user.role === 'user' ? messages.MAKE_ADMIN : messages.MAKE_USER}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-data">{messages.NO_DATA}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;

// Attribution: ChatGPT was used for structure and organization of the code and Copilot was used to assist in writing the code.