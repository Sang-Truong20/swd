import axios from 'axios';
import Cookies from 'js-cookie';
import { refresh } from '../services/auth';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  async (config) => {
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  },
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = Cookies.get('refreshToken');

      if (refreshToken) {
        try {
          const res = await refresh({ refreshToken: refreshToken });

          if (res && res.status === 200) {
            const newAccessToken = res.data.accessToken;

            Cookies.set('accessToken', newAccessToken);

            originalRequest.headers['Authorization'] =
              `Bearer ${newAccessToken}`;
            axiosClient.defaults.headers.common['Authorization'] =
              `Bearer ${newAccessToken}`;

            return axiosClient(originalRequest);
          }
        } catch (error) {
          console.error('err', error);
        }
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
