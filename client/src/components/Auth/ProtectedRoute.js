import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, children }) => {
  // Not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // User is authenticated, render the children
  return children;
};

export default ProtectedRoute;

// Attribution: ChatGPT was used for structure and organization of the code and Copilot was used to assist in writing the code.