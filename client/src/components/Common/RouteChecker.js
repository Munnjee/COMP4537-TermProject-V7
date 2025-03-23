import React, { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { checkRouteExists } from '../../services/routeService';
import api from '../../services/authService';
import NotFound from './NotFound';
import AccessDeniedAlert from '../Admin/AccessDeniedAlert';
import messages from '../../utils/messages';

const RouteChecker = ({ user }) => {
  const [routeExists, setRouteExists] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const [statusCode, setStatusCode] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkRoute = async () => {
      setIsChecking(true);
      setStatusCode(null);
      
      // Skip checking for reset-password routes
      if (location.pathname.startsWith('/reset-password/')) {
        setRouteExists(true);
        setIsChecking(false);
        return;
      }
      
      try {
        // Special handling for admin routes to ensure HTTP status codes appear
        if (location.pathname.startsWith('/admin/')) {
          try {
            const adminPath = location.pathname.replace('/admin', '');
            const apiPath = adminPath === '/' ? '/verify-access' : adminPath;
            await api.get(`/admin${apiPath}`);
            
            // If successful, route exists and user has permission
            setRouteExists(true);
            setStatusCode(200);
          } catch (error) {
            if (error.response) {
              setStatusCode(error.response.status);
              if (error.response.status === 404) {
                setRouteExists(false);
              } else if (error.response.status === 401 || error.response.status === 403) {
                setRouteExists(true); // Route exists but user doesn't have permission
              }
            } else {
              setStatusCode(500);
              setRouteExists(false);
            }
          }
          
          setIsChecking(false);
          return;
        }
        
        // For non-admin routes, use the existing check
        const exists = await checkRouteExists(location.pathname);
        setRouteExists(exists);
      } catch (error) {
        console.error('Route check error:', error);
        setRouteExists(false);
        
        if (error.response) {
          setStatusCode(error.response.status);
        }
      } finally {
        setIsChecking(false);
      }
    };

    checkRoute();
  }, [location.pathname]);

  if (isChecking) {
    return <div className="loading">{messages.LOADING}</div>;
  }
  
  // Handle status codes for admin routes
  if (location.pathname.startsWith('/admin/')) {
    if (statusCode === 401 || statusCode === 403) {
      return <AccessDeniedAlert onClose={() => window.location.href = '/'} redirectTimeout={5} />;
    }
    
    if (statusCode === 404 || routeExists === false) {
      return <NotFound />;
    }
    
    if (statusCode === 200 && user && user.role === 'admin') {
      if (location.pathname === '/admin/dashboard') {
        return null; // Let the route render the dashboard
      } else {
        return <Navigate to="/admin/dashboard" />;
      }
    }
  }

  // If route doesn't exist for non-admin routes, show 404 page
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