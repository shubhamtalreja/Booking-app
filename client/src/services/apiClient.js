import ENV_CONFIG from '@/config/EnvConfig';
import axios from 'axios';


const apiClient = axios.create({
  baseURL: ENV_CONFIG.BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user');

    if (user) {
      const parsedUser = JSON.parse(user);
      
      if (parsedUser.token) {
        config.headers.Authorization = `Bearer ${parsedUser.token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;