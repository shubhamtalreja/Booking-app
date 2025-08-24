import apiClient from "./apiClient";


export const getAppointments = async () => {
  try {
    const response = await apiClient.get('/appointments/me');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching all appointments:', error.response ? error.response.data : error.message);
    throw new Error('Failed to fetch appointments for the admin dashboard.');
  }
}

export const getAllAppointments = async () => {
  try {
    const response = await apiClient.get('/appointments');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching my appointments:', error.response ? error.response.data : error.message);
    throw new Error('Failed to fetch appointments.');
  }
}


export const cancelAppointment = async (appointmentId) => {
  try {
    const response = await apiClient.delete(`/appointments/${appointmentId}`);
    return response.data;
  } catch (error) {
    console.error('Error cancelling appointment:', error.response ? error.response.data : error.message);
    throw new Error(error.response?.data?.message || 'Failed to cancel appointment.');
  }
}