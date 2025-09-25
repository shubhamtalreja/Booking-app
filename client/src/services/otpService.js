import apiClient from "./apiClient";

export const generateOtp = async (email) => {
    try {
        const response = await apiClient.post('/otp/send', email);
        return response.data;
    } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        throw error.response?.data || new Error('An unknown error occurred during login.');
    }
};