import apiClient from "./apiClient";
import { format } from "date-fns";


export const getAvailability = async (serviceId, date) => {
    if (!serviceId || !date) {
        return [];
    }
    try {
        const dateSting = format(date, 'yyyy-MM-dd');
        const response = await apiClient.get('/availability', {
            params: {
                date: dateSting,
                serviceId
            }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching availability:', error.response ? error.response.data : error.message);
        throw new Error('Failed to fetch available time slots.');
    }
} 