import axios from 'axios';
import { API_URL } from '../config';

// Check if a route exists on the backend
export const checkRouteExists = async (route) => {
  try {
    const cleanRoute = route.replace(window.location.origin, '');
    
    let apiRoute = `${API_URL}${cleanRoute}`;
    
    if (!apiRoute.includes('/api/v1')) {
      apiRoute = `${API_URL}${cleanRoute}`;
    }
    
    await axios.head(apiRoute);
    return true;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return false;
    }
    
    return true;
  }
};