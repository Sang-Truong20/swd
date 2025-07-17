import axiosClient from '../../../configs/axiosClient';

// API endpoints 
const API_ENDPOINTS = {
  // User Management
  USERS: {
    CREATE: '/command/user',
    UPDATE: (userId) => `/command/user/${userId}`,
    BLOCK: (userId) => `/command/user/block/${userId}`,
    UNBLOCK: (userId) => `/command/user/unblock/${userId}`,
    CHANGE_PASSWORD: (userId, oldPassword, newPassword) => `/command/user/${userId}/change-password?oldPassword=${oldPassword}&newPassword=${newPassword}`,
    
    LIST: '/query/users', // list users
    GET_BY_ID: (userId) => `/query/users/userId/${userId}`,
    GET_BY_EMAIL: (email) => `/query/users/email/${email}`,
    GET_BY_ROLE: (role) => `/query/users/role/${role}`,
    CHECK_USERNAME: (userName) => `/query/users/check/username/${userName}`,
    CHECK_EMAIL: (email) => `/query/users/check/email/${email}`,
  },
  
  // Package Management  
  PACKAGES: {
    CREATE: '/command/package',
    UPDATE: (id) => `/command/package/${id}`,
    DISABLE: (id) => `/command/package/disable/${id}`,
    ENABLE: (id) => `/command/package/enable/${id}`,
    LIST_ALL: '/query/package/all',
    LIST_ACTIVE: '/query/package/active',
    GET_BY_ID: (id) => `/query/package/${id}`,
    SEARCH: (name) => `/query/package/search?name=${name}`,
    FILTER_BY_PRICE: (maxPrice) => `/query/package/price?maxPrice=${maxPrice}`,
  },
  
  // User Package Management
  USER_PACKAGES: {
    CREATE: '/command/user-package',
    BLOCK: (id) => `/command/user-package/${id}/block`,
    UNBLOCK: (id) => `/command/user-package/${id}/unblock`,
    LIST_ALL: '/query/package/user',
    LIST_EXPIRED: '/query/package/user/expired',
    SEARCH: (packageName) => `/query/package/user/search?packageName=${packageName}`,
    GET_USER_ACTIVE: (userId) => `/query/package/user/active/${userId}`,
    GET_USER_HISTORY: (userId, page = 0, size = 10) => `/query/package/user/history/${userId}?page=${page}&size=${size}`,
  },
  
  // Law Management
  LAWS: {
    CREATE: '/command/law',
    UPDATE: (lawId) => `/command/law/${lawId}`,
    DELETE: (lawId) => `/command/law/${lawId}`,
    CHANGE_STATUS: (lawId) => `/command/law/${lawId}/status`,
    
    LIST_ALL: (page = 0, size = 10, sortBy = 'effectiveDate', sortDirection = 'DESC') => 
      `/query/law?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`,
    GET_BY_ID: (lawId) => `/query/law/${lawId}`,
    GET_VALID: '/query/law/valid',
    GET_BY_TYPE: (lawTypeName) => `/query/law/type/${lawTypeName}`,
    GET_BY_NUMBER: (lawNumber) => `/query/law/number/${lawNumber}`,
    GET_BY_ISSUING_BODY: (issuingBody) => `/query/law/issuing-body/${issuingBody}`,
    SEARCH: (page = 0, size = 10, sortBy = 'effectiveDate', sortDirection = 'DESC') => 
      `/query/law/search?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`,
  },
  
  // Law Type Management
  LAW_TYPES: {
    CREATE: '/command/lawtype',
    UPDATE: (lawTypeId) => `/command/lawtype/${lawTypeId}`,
    DELETE: (lawTypeId) => `/command/lawtype/${lawTypeId}`,
    
    LIST_ALL: '/query/law-type',
    GET_BY_ID: (lawTypeId) => `/query/law-type/${lawTypeId}`,
    GET_ACTIVE: '/query/law-type/active',
    SEARCH: (name) => `/query/law-type/search?name=${name}`,
  },
  
  // Chat History
  CHAT_HISTORY: {
    GET_BY_USER: (userId) => `/query/chat-history/${userId}`,
  },
  
  // Gemini AI
  GEMINI: {
    ASK: (question, userId) => `/gemini/ask?question=${encodeURIComponent(question)}&userId=${userId}`,
  },
  
  // Payment
  PAYMENT: {
    CREATE_VNPAY: '/vnpay/payment',
    VNPAY_IPN: '/vnpay/ipn',
    VNPAY_RETURN: '/vnpay/return',
  },
  
  // Export
  EXPORT: {
    GET_FILE_INFO: '/query/export/laws/file-info',
    APPEND_SINGLE: (lawId) => `/query/export/laws/append-single/${lawId}`,
    APPEND_BY_TYPE: (lawType) => `/query/export/laws/append-by-type?lawType=${lawType}`,
    APPEND_ALL: '/query/export/laws/append-all',
    CLEAR_FILE: (confirm = false) => `/query/export/laws/clear-file?confirm=${confirm}`,
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

// Law Management Services
export const lawService = {
  async createLaw(lawData) {
    try {
      const response = await axiosClient.post(API_ENDPOINTS.LAWS.CREATE, lawData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể tạo văn bản pháp luật');
    }
  },

  async updateLaw(lawId, lawData) {
    try {
      const response = await axiosClient.put(API_ENDPOINTS.LAWS.UPDATE(lawId), lawData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể cập nhật văn bản pháp luật');
    }
  },

  async deleteLaw(lawId) {
    try {
      await axiosClient.delete(API_ENDPOINTS.LAWS.DELETE(lawId));
      return { success: true };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể xóa văn bản pháp luật');
    }
  },

  async changeLawStatus(lawId, status) {
    try {
      const response = await axiosClient.patch(API_ENDPOINTS.LAWS.CHANGE_STATUS(lawId), status, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể thay đổi trạng thái văn bản pháp luật');
    }
  },

  async getAllLaws(page = 0, size = 10, sortBy = 'effectiveDate', sortDirection = 'DESC') {
    try {
      const response = await axiosClient.get(API_ENDPOINTS.LAWS.LIST_ALL(page, size, sortBy, sortDirection));
      return response.data?.data || response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách văn bản pháp luật');
    }
  },

  async getLawById(lawId) {
    try {
      const response = await axiosClient.get(API_ENDPOINTS.LAWS.GET_BY_ID(lawId));
      return response.data?.data || response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy thông tin văn bản pháp luật');
    }
  },

  async getValidLaws() {
    try {
      const response = await axiosClient.get(API_ENDPOINTS.LAWS.GET_VALID);
      return response.data?.data || response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách văn bản có hiệu lực');
    }
  },

  async getLawsByType(lawTypeName) {
    try {
      const response = await axiosClient.get(API_ENDPOINTS.LAWS.GET_BY_TYPE(lawTypeName));
      return response.data?.data || response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy văn bản theo loại');
    }
  },

  async getLawByNumber(lawNumber) {
    try {
      const response = await axiosClient.get(API_ENDPOINTS.LAWS.GET_BY_NUMBER(lawNumber));
      return response.data?.data || response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể tìm văn bản theo số');
    }
  },

  async getLawsByIssuingBody(issuingBody) {
    try {
      const response = await axiosClient.get(API_ENDPOINTS.LAWS.GET_BY_ISSUING_BODY(issuingBody));
      return response.data?.data || response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy văn bản theo cơ quan ban hành');
    }
  },

  async searchLaws(criteria, page = 0, size = 10, sortBy = 'effectiveDate', sortDirection = 'DESC') {
    try {
      const response = await axiosClient.post(API_ENDPOINTS.LAWS.SEARCH(page, size, sortBy, sortDirection), criteria);
      return response.data?.data || response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể tìm kiếm văn bản pháp luật');
    }
  }
};

// Law Type Management Services
export const lawTypeService = {
  async createLawType(lawTypeData) {
    try {
      const response = await axiosClient.post(API_ENDPOINTS.LAW_TYPES.CREATE, lawTypeData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể tạo loại văn bản');
    }
  },

  async updateLawType(lawTypeId, lawTypeData) {
    try {
      const response = await axiosClient.put(API_ENDPOINTS.LAW_TYPES.UPDATE(lawTypeId), lawTypeData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể cập nhật loại văn bản');
    }
  },

  async deleteLawType(lawTypeId) {
    try {
      await axiosClient.delete(API_ENDPOINTS.LAW_TYPES.DELETE(lawTypeId));
      return { success: true };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể xóa loại văn bản');
    }
  },

  async getAllLawTypes() {
    try {
      const response = await axiosClient.get(API_ENDPOINTS.LAW_TYPES.LIST_ALL);
      return response.data?.data || response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách loại văn bản');
    }
  },

  async getLawTypeById(lawTypeId) {
    try {
      const response = await axiosClient.get(API_ENDPOINTS.LAW_TYPES.GET_BY_ID(lawTypeId));
      return response.data?.data || response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy thông tin loại văn bản');
    }
  },

  async getActiveLawTypes() {
    try {
      const response = await axiosClient.get(API_ENDPOINTS.LAW_TYPES.GET_ACTIVE);
      return response.data?.data || response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách loại văn bản hoạt động');
    }
  },

  async searchLawTypes(name) {
    try {
      const response = await axiosClient.get(API_ENDPOINTS.LAW_TYPES.SEARCH(name));
      return response.data?.data || response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể tìm kiếm loại văn bản');
    }
  }
};

// Analytics Service  
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
        }).length,
        totalLaws: 0, // Will be updated when we can fetch laws
        validLaws: 0   // Will be updated when we can fetch laws
      };

      // Try to get laws data
      try {
        const lawsResponse = await lawService.getAllLaws(0, 1);
        if (lawsResponse && lawsResponse.totalElements !== undefined) {
          stats.totalLaws = lawsResponse.totalElements;
          if (lawsResponse.content && Array.isArray(lawsResponse.content)) {
            stats.validLaws = lawsResponse.content.filter(law => law?.status === 'VALID').length;
          }
        }
      } catch (lawError) {
        console.warn('Could not fetch laws data:', lawError);
      }

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
        expiringSoon: 0,
        totalLaws: 0,
        validLaws: 0
      };
    }
  }
};

export default {
  userService,
  packageService,
  userPackageService,
  lawService,
  lawTypeService,
  analyticsService,
  API_ENDPOINTS
};
