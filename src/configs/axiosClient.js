import axios from 'axios';

const axiosClient = axios.create({
  // Sử dụng proxy thay vì direct call để tránh CORS
  baseURL: import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '' : 'http://localhost:8080'),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
  withCredentials: false, // Disable credentials for CORS
});

axiosClient.interceptors.request.use(
  async (config) => {
    // Thêm token vào header nếu có
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request for debugging
    console.log('🔗 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      headers: config.headers,
      hasToken: !!token
    });
    
    return config;
  },
  (err) => {
    console.error('❌ Request Error:', err);
    return Promise.reject(err);
  },
);

axiosClient.interceptors.response.use(
  (response) => {
    // Log successful response
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  async (error) => {
    // Log error response
    console.error('❌ API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    });

    // Handle 401 (Unauthorized) - token expired or invalid
    if (error.response?.status === 401) {
      console.warn('🔐 Token expired or invalid, clearing auth data');
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/auth')) {
        window.location.href = '/auth';
      }
    }

    // Handle 403 (Forbidden) - insufficient permissions
    if (error.response?.status === 403) {
      console.warn('🚫 Access denied - insufficient permissions');
      // You might want to show a permission denied message
      // or redirect to a different page
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
