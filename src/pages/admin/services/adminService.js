import axiosClient from '../../../configs/axiosClient';

// API endpoints 
const API_ENDPOINTS = {
  // User Management
  USERS: {
    CREATE: '/api/command/user',
    UPDATE: (userId) => `/api/command/user/${userId}`,
    BLOCK: (userId) => `/api/command/user/block/${userId}`,
    UNBLOCK: (userId) => `/api/command/user/unblock/${userId}`,
    
    LIST: '/api/query/user', // list users
  },
  
  // Package Management  
  PACKAGES: {
    CREATE: '/api/command/package',
    UPDATE: (id) => `/api/command/package/${id}`,
    DISABLE: (id) => `/api/command/package/disable/${id}`,
    ENABLE: (id) => `/api/command/package/enable/${id}`,
    LIST_ALL: '/api/query/package/all',
    LIST_ACTIVE: '/api/query/package/active',
    GET_BY_ID: (id) => `/api/query/package/${id}`,
    SEARCH: (name) => `/api/query/package/search?name=${name}`,
    FILTER_BY_PRICE: (maxPrice) => `/api/query/package/price?maxPrice=${maxPrice}`,
  },
  
  // User Package Management
  USER_PACKAGES: {
    BLOCK: (id) => `/api/command/user-package/${id}/block`,
    UNBLOCK: (id) => `/api/command/user-package/${id}/unblock`,
    LIST_ALL: '/api/query/package/user',
    LIST_EXPIRED: '/api/query/package/user/expired',
    SEARCH: (packageName) => `/api/query/package/user/search?packageName=${packageName}`,
    GET_USER_ACTIVE: (userId) => `/api/query/package/user/active/${userId}`,
    GET_USER_HISTORY: (userId, page = 0, size = 10) => `/api/query/package/user/history/${userId}?page=${page}&size=${size}`,
  },
  
  // Chat History
  CHAT_HISTORY: {
    GET_BY_USER: (userId) => `/api/query/chat-history/${userId}`,
  }
};

// User Management Services
export const userService = {
  async createUser(userData) {
    try {
      const response = await axiosClient.post(API_ENDPOINTS.USERS.CREATE, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể tạo user');
    }
  },

  async updateUser(userId, userData) {
    try {
      const response = await axiosClient.put(API_ENDPOINTS.USERS.UPDATE(userId), userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể cập nhật user');
    }
  },

  async blockUser(userId) {
    try {
      await axiosClient.put(API_ENDPOINTS.USERS.BLOCK(userId));
      return { success: true };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể block user');
    }
  },

  async unblockUser(userId) {
    try {
      await axiosClient.put(API_ENDPOINTS.USERS.UNBLOCK(userId));
      return { success: true };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể unblock user');
    }
  },

  // This endpoint might need to be implemented in backend
  async getAllUsers() {
    try {
      const response = await axiosClient.get(API_ENDPOINTS.USERS.LIST);
      return Array.isArray(response.data) ? response.data : (response.data ? [response.data] : []);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách user');
    }
  }
};

// Package Management Services
export const packageService = {
  async createPackage(packageData) {
    try {
      const response = await axiosClient.post(API_ENDPOINTS.PACKAGES.CREATE, packageData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể tạo gói dịch vụ');
    }
  },

  async updatePackage(packageId, packageData) {
    try {
      const response = await axiosClient.put(API_ENDPOINTS.PACKAGES.UPDATE(packageId), packageData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể cập nhật gói dịch vụ');
    }
  },

  async disablePackage(packageId) {
    try {
      await axiosClient.put(API_ENDPOINTS.PACKAGES.DISABLE(packageId));
      return { success: true };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể vô hiệu hóa gói dịch vụ');
    }
  },

  async enablePackage(packageId) {
    try {
      await axiosClient.put(API_ENDPOINTS.PACKAGES.ENABLE(packageId));
      return { success: true };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể kích hoạt gói dịch vụ');
    }
  },

  async getAllPackages() {
    try {
      const response = await axiosClient.get(API_ENDPOINTS.PACKAGES.LIST_ALL);
      return Array.isArray(response.data) ? response.data : (response.data ? [response.data] : []);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách gói dịch vụ');
    }
  },

  async getActivePackages() {
    try {
      const response = await axiosClient.get(API_ENDPOINTS.PACKAGES.LIST_ACTIVE);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách gói dịch vụ hoạt động');
    }
  },

  async getPackageById(packageId) {
    try {
      const response = await axiosClient.get(API_ENDPOINTS.PACKAGES.GET_BY_ID(packageId));
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy thông tin gói dịch vụ');
    }
  },

  async searchPackages(name) {
    try {
      const response = await axiosClient.get(API_ENDPOINTS.PACKAGES.SEARCH(name));
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể tìm kiếm gói dịch vụ');
    }
  }
};

// User Package Management Services
export const userPackageService = {
  async blockUserPackage(userPackageId) {
    try {
      await axiosClient.put(API_ENDPOINTS.USER_PACKAGES.BLOCK(userPackageId));
      return { success: true };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể khóa gói đăng ký');
    }
  },

  async unblockUserPackage(userPackageId) {
    try {
      await axiosClient.put(API_ENDPOINTS.USER_PACKAGES.UNBLOCK(userPackageId));
      return { success: true };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể mở khóa gói đăng ký');
    }
  },

  async getAllUserPackages() {
    try {
      const response = await axiosClient.get(API_ENDPOINTS.USER_PACKAGES.LIST_ALL);
      return Array.isArray(response.data) ? response.data : (response.data ? [response.data] : []);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách gói đăng ký');
    }
  },

  async getExpiredUserPackages() {
    try {
      const response = await axiosClient.get(API_ENDPOINTS.USER_PACKAGES.LIST_EXPIRED);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách gói hết hạn');
    }
  },

  async searchUserPackages(packageName) {
    try {
      const response = await axiosClient.get(API_ENDPOINTS.USER_PACKAGES.SEARCH(packageName));
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể tìm kiếm gói đăng ký');
    }
  },

  async getUserActivePackages(userId) {
    try {
      const response = await axiosClient.get(API_ENDPOINTS.USER_PACKAGES.GET_USER_ACTIVE(userId));
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy gói đang hoạt động của user');
    }
  },

  async getUserPackageHistory(userId, page = 0, size = 10) {
    try {
      const response = await axiosClient.get(API_ENDPOINTS.USER_PACKAGES.GET_USER_HISTORY(userId, page, size));
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy lịch sử gói của user');
    }
  }
};

export const analyticsService = {
  async getDashboardStats() {
    try {
      const [packagesResponse, userPackagesResponse] = await Promise.all([
        packageService.getAllPackages().catch(() => []),
        userPackageService.getAllUserPackages().catch(() => [])
      ]);

      // Ensure we always have arrays to work with, with null checking
      const packages = Array.isArray(packagesResponse) ? packagesResponse : [];
      const userPackages = Array.isArray(userPackagesResponse) ? userPackagesResponse : [];

      const stats = {
        totalPackages: packages.length,
        activePackages: packages.filter(pkg => pkg && pkg.isEnable === true).length,
        totalSubscriptions: userPackages.length,
        activeSubscriptions: userPackages.filter(pkg => pkg && pkg.status === 'ACTIVE').length,
        expiredSubscriptions: userPackages.filter(pkg => pkg && pkg.status === 'EXPIRED').length,
        blockedSubscriptions: userPackages.filter(pkg => pkg && pkg.status === 'BLOCKED').length,
        expiringSoon: userPackages.filter(pkg => {
          if (!pkg || pkg.status !== 'ACTIVE' || !pkg.expirationDate) return false;
          try {
            const expDate = new Date(pkg.expirationDate);
            const now = new Date();
            const diffTime = expDate - now;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 7 && diffDays > 0;
          } catch (error) {
            return false;
          }
        }).length
      };

      return stats;
    } catch (error) {
      console.error('Analytics service error:', error);
      // Return default stats if everything fails
      return {
        totalPackages: 0,
        activePackages: 0,
        totalSubscriptions: 0,
        activeSubscriptions: 0,
        expiredSubscriptions: 0,
        blockedSubscriptions: 0,
        expiringSoon: 0
      };
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
