import React, { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { checkRouteExists } from '../../services/routeService';
import NotFound from './NotFound';
import messages from '../../utils/messages';

const RouteChecker = ({ user }) => {
  const [routeExists, setRouteExists] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkRoute = async () => {
      setIsChecking(true);
      
      // Skip checking for known frontend routes
      const knownRoutes = [
        '/login', 
        '/register', 
        '/forgot-password', 
        '/', 
        '/admin/dashboard', 
        '/game'
      ];
      
      // Also skip checking for routes that start with /reset-password/
      if (
        knownRoutes.includes(location.pathname) || 
        location.pathname.startsWith('/reset-password/')
      ) {
        setRouteExists(true);
        setIsChecking(false);
        return;
      }
      
      // Check if the route exists on the backend
      const exists = await checkRouteExists(location.pathname);
      setRouteExists(exists);
      setIsChecking(false);
    };

    checkRoute();
  }, [location.pathname]);

  // Show loading while checking
  if (isChecking) {
    return <div className="loading">{messages.LOADING}</div>;
  }

  // If route doesn't exist, show 404 page
  if (routeExists === false) {
    return <NotFound />;
  }

  // If route exists but user isn't authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If user is authenticated, redirect to their appropriate dashboard
  return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/'} />;
};

export default RouteChecker;

// Attribution: ChatGPT was used for structure and organization of the code and Copilot was used to assist in writing the code.