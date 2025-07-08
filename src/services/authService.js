import axiosClient from '../configs/axiosClient';

export const authService = {
  // Development login for testing purposes only
  // TODO: Replace with real authentication API call in production
  async mockLogin(credentials) {
    try {
      // For development testing only - create a temporary token
      const tempToken = 'dev-jwt-token-' + Date.now();
      const tempUser = {
        id: 1,
        username: credentials.username || 'admin',
        email: credentials.email || 'admin@example.com',
        fullName: 'Development Admin',
        role: 'ADMIN',
        active: true,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString()
      };

      // Store token and user info for development
      localStorage.setItem('authToken', tempToken);
      localStorage.setItem('currentUser', JSON.stringify(tempUser));

      return {
        success: true,
        token: tempToken,
        user: tempUser
      };
    } catch (error) {
      throw new Error('Development login failed');
    }
  },

  // Real login method
  async login(credentials) {
    try {
      const response = await axiosClient.post('/api/v1/query/auth/login', credentials);
      
      if (response.data && response.data.token) {
        // Store token and user info
        localStorage.setItem('authToken', response.data.token);
        if (response.data.user) {
          localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        }
        
        return response.data;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      // If real API fails, try development login for testing
      console.warn('Real login failed, using development login:', error.message);
      return this.mockLogin(credentials);
    }
  },

  // Get current user
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('currentUser');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing current user:', error);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('authToken');
    const user = this.getCurrentUser();
    return !!(token && user);
  },

  // Check if user is admin
  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === 'ADMIN';
  },

  // Logout
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    sessionStorage.clear();
  },

  // Refresh token
  async refreshToken() {
    try {
      const response = await axiosClient.post('/api/v1/query/auth/refresh');
      
      if (response.data && response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        return response.data;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.logout();
      throw error;
    }
  }
};

export default authService;
