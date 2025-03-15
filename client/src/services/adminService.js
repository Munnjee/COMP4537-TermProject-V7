import api from './authService';

// Get API stats
export const getApiStats = async () => {
  try {
    const response = await api.get('/admin/stats');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Get user stats
export const getUserStats = async () => {
  try {
    const response = await api.get('/admin/users/stats');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Get all users
export const getUsers = async () => {
  try {
    const response = await api.get('/admin/users');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Update user role
export const updateUserRole = async (userId, role) => {
  try {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Attribution: ChatGPT was used for structure and organization of the code and Copilot was used to assist in writing the code.