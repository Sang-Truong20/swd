import axiosClient from '../configs/axiosClient';

// Law Service - requires authentication
export const lawService = {
  // Lấy tất cả văn bản pháp luật
  async getAllLaws(page = 0, size = 10, sortBy = 'effectiveDate', sortDirection = 'DESC') {
    try {
      const response = await axiosClient.get(`/query/law?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể tải danh sách văn bản pháp luật');
    }
  },

  // Lấy văn bản có hiệu lực (fallback to all laws if valid endpoint doesn't exist)
  async getValidLaws(page = 0, size = 10, sortBy = 'effectiveDate', sortDirection = 'DESC') {
    try {
      // Try valid endpoint first
      const response = await axiosClient.get(`/query/law/valid?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`);
      return response.data;
    } catch (error) {
      // Fallback to all laws and filter VALID status
      try {
        const response = await axiosClient.get(`/query/law?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`);
        return response.data;
      } catch (fallbackError) {
        throw new Error(fallbackError.response?.data?.message || 'Không thể tải danh sách văn bản pháp luật');
      }
    }
  },

  // Lấy văn bản theo loại
  async getLawsByType(lawTypeName, page = 0, size = 10) {
    try {
      const response = await axiosClient.get(`/query/law/type/${lawTypeName}?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể tải văn bản theo loại');
    }
  },

  // Lấy chi tiết văn bản theo ID
  async getLawById(lawId) {
    try {
      const response = await axiosClient.get(`/query/law/${lawId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể tải chi tiết văn bản');
    }
  },

  // Lấy văn bản theo số văn bản
  async getLawByNumber(lawNumber) {
    try {
      const response = await axiosClient.get(`/query/law/number/${lawNumber}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể tìm văn bản');
    }
  },

  // Tìm kiếm văn bản
  async searchLaws(criteria, page = 0, size = 10, sortBy = 'effectiveDate', sortDirection = 'DESC') {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sortBy,
        sortDirection,
        ...criteria
      });
      
      const response = await axiosClient.get(`/query/law/search?${params}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Tìm kiếm thất bại');
    }
  }
};

// Law Type Service
export const lawTypeService = {
  async getAllLawTypes() {

      const response = await axiosClient.get('/query/law-type');
      return response.data;

  }
};

// For backward compatibility
export const publicLawService = lawService;
export const publicLawTypeService = lawTypeService;


