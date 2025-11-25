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
export const createService = async (serviceData) => {
    try {
        const response = await apiClient.post('/services', serviceData);

        return response.data.service;
    } catch (error) {
        console.error('Error creating service:', error.response ? error.response.data : error.message);
        throw new Error(error.response?.data?.message || 'Failed to create service.');
    }

}
export const updateService = async (id, serviceData) => {
    try {
        const response = await apiClient.put(`/services/${id}`, serviceData);

        return response.data.updateService;
    } catch (error) {
        console.error('Error updating service:', error.response ? error.response.data : error.message);
        throw new Error(error.response?.data?.message || 'Failed to update service.');
    }

}
export const deleteService = async (id) => {
    try {
        const response = await apiClient.delete(`/services/${id}`);

        return response.data.data;
    } catch (error) {
        console.error('Error deleting service:', error.response ? error.response.data : error.message);
        throw new Error(error.response?.data?.message || 'Failed to delete service.');
    }

}
export const getVendorServices = async (id) => {
    try {
        const response = await apiClient.get(`/services/vendor/${id}`);

        return response.data.data;
    } catch (error) {
        console.error('Error getting vendor service:', error.response ? error.response.data : error.message);
        throw new Error(error.response?.data?.message || 'Failed to get vendor service.');
    }

}