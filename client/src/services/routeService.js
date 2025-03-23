import axios from 'axios';
import { API_URL } from '../config';

// Check if a route exists on the backend
export const checkRouteExists = async (route) => {
  try {
    const cleanRoute = route.replace(window.location.origin, '');
    
    // Special handling for admin routes
    if (cleanRoute.startsWith('/admin/') && cleanRoute !== '/admin/dashboard') {
      try {
        // Try to access the admin route to get proper status code
        let apiRoute = `${API_URL}/admin${cleanRoute.replace('/admin', '')}`;
        await axios.head(apiRoute, { withCredentials: true });
        return true; // If no error, route exists
      } catch (error) {
        if (error.response) {
          // Return proper info based on status code
          if (error.response.status === 401 || error.response.status === 403) {
            throw { status: error.response.status, message: 'Unauthorized' };
          } else if (error.response.status === 404) {
            return false; // Route doesn't exist
          }
        }
        return false; // Default to not exist on error
      }
    }
    
    // Handle non-admin routes
    let apiRoute = `${API_URL}${cleanRoute}`;
    
    if (!apiRoute.includes('/api/v1')) {
      apiRoute = `${API_URL}${cleanRoute}`;
    }
    
    await axios.head(apiRoute);
    return true;
  } catch (error) {
    if (error.status) {
      // This is our custom error with status code
      throw error;
    }
    
    if (error.response && error.response.status === 404) {
      return false;
    }
    
    return true;
  }
};

// Attribution: ChatGPT was used for structure and organization of the code and Copilot was used to assist in writing the code.