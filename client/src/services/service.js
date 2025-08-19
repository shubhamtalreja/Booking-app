import apiClient from './apiClient';

export const getAllServices = async () => {
    try {
        const response = await apiClient.get('/services');

        return response.data.allServices;
    } catch (error) {
        console.error('Error fetching services:', error.response ? error.response.data : error.message);
        throw error;
    }

}