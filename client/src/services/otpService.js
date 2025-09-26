import apiClient from "./apiClient";

export const generateOtp = async (email) => {
    try {
        const response = await apiClient.post('/otp/send', email);
        return response.data;
    } catch (error) {
        console.error('otp error:', error.response?.data || error.message);
        throw error.response?.data || new Error('An unknown error occurred during sending otp.');
    }
};

export const validateOtp = async (creds) => {
    try {
        const response = await apiClient.post('/otp/validate', creds);
        return response.data;
    } catch (error) {
        console.error('otp error:', error.response?.data || error.message);
        throw error.response?.data || new Error('An unknown error occurred during validate otp.');
    }
};