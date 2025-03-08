import React from 'react';
import { Navigate } from 'react-router-dom';
import messages from '../../utils/messages';

const ProtectedRoute = ({ user, children, adminOnly = false }) => {
  // Not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // Admin route check
  if (adminOnly && user.role !== 'admin') {
    return (
      <div className="unauthorized">
        <h2>{messages.ADMIN_ONLY}</h2>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }
  
  return children;
};

export default ProtectedRoute;