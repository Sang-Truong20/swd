import axiosClient from '../../../configs/axiosClient';

// API endpoints 
const API_ENDPOINTS = {
  // User Management
  USERS: {
    CREATE: '/api/v1/command/user',
    UPDATE: (userId) => `/api/v1/command/user/${userId}`,
    BLOCK: (userId) => `/api/v1/command/user/block/${userId}`,
    UNBLOCK: (userId) => `/api/v1/command/user/unblock/${userId}`,
    CHANGE_PASSWORD: (userId) => `/api/v1/command/user/${userId}/change-password`,
    
    LIST: '/api/v1/query/users', // list all users
    GET_BY_ID: (userId) => `/api/v1/query/users/userId/${userId}`,
    GET_BY_EMAIL: (email) => `/api/v1/query/users/email/${email}`,
    GET_BY_ROLE: (role) => `/api/v1/query/users/role/${role}`,
    CHECK_USERNAME: (username) => `/api/v1/query/users/check/username/${username}`,
    CHECK_EMAIL: (email) => `/api/v1/query/users/check/email/${email}`,
  },
  
  // Package Management  
  PACKAGES: {
    CREATE: '/api/v1/command/package',
    UPDATE: (id) => `/api/v1/command/package/${id}`,
    DISABLE: (id) => `/api/v1/command/package/disable/${id}`,
    ENABLE: (id) => `/api/v1/command/package/enable/${id}`,
    LIST_ALL: '/api/v1/query/package/all',
    LIST_ACTIVE: '/api/v1/query/package/active',
    GET_BY_ID: (id) => `/api/v1/query/package/${id}`,
    SEARCH: (name) => `/api/v1/query/package/search?name=${name}`,
    FILTER_BY_PRICE: (maxPrice) => `/api/v1/query/package/price?maxPrice=${maxPrice}`,
  },
  
  // User Package Management
  USER_PACKAGES: {
    CREATE: '/api/v1/command/user-package',
    BLOCK: (id) => `/api/v1/command/user-package/${id}/block`,
    UNBLOCK: (id) => `/api/v1/command/user-package/${id}/unblock`,
    LIST_ALL: '/api/v1/query/package/user',
    LIST_EXPIRED: '/api/v1/query/package/user/expired',
    SEARCH: (packageName) => `/api/v1/query/package/user/search?packageName=${packageName}`,
    GET_USER_ACTIVE: (userId) => `/api/v1/query/package/user/active/${userId}`,
    GET_USER_HISTORY: (userId, page = 0, size = 10) => `/api/v1/query/package/user/history/${userId}?page=${page}&size=${size}`,
  },
  
  // Additional endpoints
  CHAT_HISTORY: {
    GET_BY_USER: (userId) => `/api/v1/query/chat-history/${userId}`,
  },
  AUTH: {
    LOGIN: '/api/v1/query/auth/login',
    REFRESH: '/api/v1/query/auth/refresh',
  },
  PAYMENT: {
    CREATE: '/api/v1/vnpay/payment',
    RETURN: '/api/v1/vnpay/return',
    IPN: '/api/v1/vnpay/ipn',
  }
};

// User Management Services
export const userService = {
  async getAllUsers() {
    try {
      console.log('🔄 Fetching users from:', API_ENDPOINTS.USERS.LIST);
      const response = await axiosClient.get(API_ENDPOINTS.USERS.LIST);
      console.log('✅ Users response:', response.data);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      
      // Handle specific CORS error
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra CORS configuration.');
      }
      
      // Handle 403 Forbidden
      if (error.response?.status === 403) {
        throw new Error('Không có quyền truy cập. Vui lòng đăng nhập với tài khoản admin.');
      }
      
      // Handle 401 Unauthorized
      if (error.response?.status === 401) {
        throw new Error('Token không hợp lệ. Vui lòng đăng nhập lại.');
      }
      
      throw new Error(error.message || 'Lỗi không xác định khi tải danh sách users');
    }
  },

  async getUserById(userId) {
    const response = await axiosClient.get(API_ENDPOINTS.USERS.GET_BY_ID(userId));
    return response.data;
  },

  async createUser(userData) {
    const response = await axiosClient.post(API_ENDPOINTS.USERS.CREATE, userData);
    return response.data;
  },

  async updateUser(userId, userData) {
    const response = await axiosClient.put(API_ENDPOINTS.USERS.UPDATE(userId), userData);
    return response.data;
  },

  async blockUser(userId) {
    await axiosClient.put(API_ENDPOINTS.USERS.BLOCK(userId));
    return { success: true };
  },

  async unblockUser(userId) {
    await axiosClient.put(API_ENDPOINTS.USERS.UNBLOCK(userId));
    return { success: true };
  },

  async changePassword(userId, passwordData) {
    const response = await axiosClient.put(API_ENDPOINTS.USERS.CHANGE_PASSWORD(userId), passwordData);
    return response.data;
  },

  async getUsersByRole(role) {
    const response = await axiosClient.get(API_ENDPOINTS.USERS.GET_BY_ROLE(role));
    return Array.isArray(response.data) ? response.data : [];
  },

  async checkUsername(username) {
    const response = await axiosClient.get(API_ENDPOINTS.USERS.CHECK_USERNAME(username));
    return response.data;
  },

  async checkEmail(email) {
    const response = await axiosClient.get(API_ENDPOINTS.USERS.CHECK_EMAIL(email));
    return response.data;
  }
};

// Package Management Services
export const packageService = {
  async createPackage(packageData) {
    const response = await axiosClient.post(API_ENDPOINTS.PACKAGES.CREATE, packageData);
    return response.data;
  },

  async updatePackage(packageId, packageData) {
    const response = await axiosClient.put(API_ENDPOINTS.PACKAGES.UPDATE(packageId), packageData);
    return response.data;
  },

  async disablePackage(packageId) {
    await axiosClient.put(API_ENDPOINTS.PACKAGES.DISABLE(packageId));
    return { success: true };
  },

  async enablePackage(packageId) {
    await axiosClient.put(API_ENDPOINTS.PACKAGES.ENABLE(packageId));
    return { success: true };
  },

  async getAllPackages() {
    const response = await axiosClient.get(API_ENDPOINTS.PACKAGES.LIST_ALL);
    return Array.isArray(response.data) ? response.data : [];
  },

  async getActivePackages() {
    const response = await axiosClient.get(API_ENDPOINTS.PACKAGES.LIST_ACTIVE);
    return Array.isArray(response.data) ? response.data : [];
  },

  async getPackageById(packageId) {
    const response = await axiosClient.get(API_ENDPOINTS.PACKAGES.GET_BY_ID(packageId));
    return response.data;
  },

  async searchPackages(name) {
    const response = await axiosClient.get(API_ENDPOINTS.PACKAGES.SEARCH(name));
    return Array.isArray(response.data) ? response.data : [];
  },

  async filterPackagesByPrice(maxPrice) {
    const response = await axiosClient.get(API_ENDPOINTS.PACKAGES.FILTER_BY_PRICE(maxPrice));
    return Array.isArray(response.data) ? response.data : [];
  }
};

// User Package Management Services
export const userPackageService = {
  async createUserPackage(userPackageData) {
    const response = await axiosClient.post(API_ENDPOINTS.USER_PACKAGES.CREATE, userPackageData);
    return response.data;
  },

  async blockUserPackage(userPackageId) {
    await axiosClient.put(API_ENDPOINTS.USER_PACKAGES.BLOCK(userPackageId));
    return { success: true };
  },

  async unblockUserPackage(userPackageId) {
    await axiosClient.put(API_ENDPOINTS.USER_PACKAGES.UNBLOCK(userPackageId));
    return { success: true };
  },

  async getAllUserPackages() {
    const response = await axiosClient.get(API_ENDPOINTS.USER_PACKAGES.LIST_ALL);
    return Array.isArray(response.data) ? response.data : [];
  },

  async getExpiredUserPackages() {
    const response = await axiosClient.get(API_ENDPOINTS.USER_PACKAGES.LIST_EXPIRED);
    return Array.isArray(response.data) ? response.data : [];
  },

  async searchUserPackages(packageName) {
    const response = await axiosClient.get(API_ENDPOINTS.USER_PACKAGES.SEARCH(packageName));
    return Array.isArray(response.data) ? response.data : [];
  },

  async getUserActivePackages(userId) {
    const response = await axiosClient.get(API_ENDPOINTS.USER_PACKAGES.GET_USER_ACTIVE(userId));
    return Array.isArray(response.data) ? response.data : [];
  },

  async getUserPackageHistory(userId, page = 0, size = 10) {
    const response = await axiosClient.get(API_ENDPOINTS.USER_PACKAGES.GET_USER_HISTORY(userId, page, size));
    return response.data;
  }
};

// Analytics Services
export const analyticsService = {
  async getDashboardStats() {
    try {
      const [usersResponse, packagesResponse, userPackagesResponse] = await Promise.all([
        userService.getAllUsers(),
        packageService.getAllPackages(),
        userPackageService.getAllUserPackages()
      ]);

      const users = Array.isArray(usersResponse) ? usersResponse : [];
      const packages = Array.isArray(packagesResponse) ? packagesResponse : [];
      const userPackages = Array.isArray(userPackagesResponse) ? userPackagesResponse : [];

      const now = new Date();
      const expiredPackages = userPackages.filter(up => 
        up.status === 'EXPIRED' || new Date(up.expirationDate) < now
      );

      const blockedPackages = userPackages.filter(up => up.status === 'BLOCKED');
      const activePackages = userPackages.filter(up => up.status === 'ACTIVE');

      return {
        totalUsers: users.length,
        activeUsers: users.filter(user => user.active === true).length,
        totalPackages: packages.length,
        activePackages: packages.filter(pkg => pkg.isEnable === true).length,
        totalSubscriptions: userPackages.length,
        activeSubscriptions: activePackages.length,
        expiredSubscriptions: expiredPackages.length,
        blockedSubscriptions: blockedPackages.length,
        expiringSoon: 0, // Would need specific logic based on business rules
        totalLaws: 0, // Would need to fetch from laws API
        activeLaws: 0
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
};

export default {
  userService,
  packageService,
  userPackageService,
  analyticsService,
  API_ENDPOINTS
};