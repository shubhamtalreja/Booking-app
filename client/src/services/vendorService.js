
import apiClient from './apiClient';

export const registerVendor = async (userData) => {
  try {
    const response = await apiClient.post('/vendor/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    throw error.response?.data || new Error('An unknown error occurred during registration.');
  }
};

export const getAllVendors = async () => {
  try {
    const response = await apiClient.get('/vendor/');
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    throw error.response?.data || new Error('Error fetching vendors');
  }
};