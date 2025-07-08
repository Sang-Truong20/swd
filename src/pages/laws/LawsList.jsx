import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import lawsService from '../../services/laws';

const LawsList = () => {
  const [laws, setLaws] = useState([]);
  const [lawTypes, setLawTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [lawsResponse, typesResponse] = await Promise.all([
        lawsService.getAllLaws(),
        lawsService.getLawTypes()
      ]);
      
      setLaws(lawsResponse.data || []);
      setLawTypes(typesResponse.data || []);
    } catch (err) {
      console.error('Error fetching laws data:', err);
      setError('Không thể tải danh sách văn bản pháp luật. Vui lòng thử lại sau.');
      // Fallback to empty arrays instead of mock data
      setLaws([]);
      setLawTypes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchData();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await lawsService.searchLaws({ query: searchQuery });
      setLaws(response.data || []);
    } catch (err) {
      console.error('Error searching laws:', err);
      setError('Không thể tìm kiếm văn bản pháp luật. Vui lòng thử lại.');
      setLaws([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterByType = async (typeId) => {
    setSelectedType(typeId);
    if (!typeId) {
      fetchData();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await lawsService.getLawsByType(typeId);
      setLaws(response.data || []);
    } catch (err) {
      console.error('Error filtering laws by type:', err);
      setError('Không thể lọc văn bản pháp luật theo loại. Vui lòng thử lại.');
      setLaws([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterByStatus = async (status) => {
    setSelectedStatus(status);
    if (!status) {
      fetchData();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await lawsService.getLawsByStatus(status);
      setLaws(response.data || []);
    } catch (err) {
      console.error('Error filtering laws by status:', err);
      setError('Không thể lọc văn bản pháp luật theo trạng thái. Vui lòng thử lại.');
      setLaws([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewLaw = (lawId) => {
    navigate(`/laws/${lawId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch {
      return 'N/A';
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      VALID: { label: 'Có hiệu lực', class: 'bg-green-100 text-green-800' },
      DRAFT: { label: 'Dự thảo', class: 'bg-yellow-100 text-yellow-800' },
      EXPIRED: { label: 'Hết hiệu lực', class: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status] || { label: status, class: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.class}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Đang tải danh sách văn bản pháp luật...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Văn bản pháp luật</h1>
        <p className="text-gray-600">Tra cứu và tìm hiểu các văn bản pháp luật hiện hành</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="flex">
              <input
                type="text"
                placeholder="Tìm kiếm văn bản pháp luật..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
              >
                Tìm kiếm
              </button>
            </div>
          </div>

          {/* Filter by Type */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => handleFilterByType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tất cả loại văn bản</option>
              {lawTypes.map((type) => (
                <option key={type.lawTypeId} value={type.lawTypeId}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Status */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => handleFilterByStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="VALID">Có hiệu lực</option>
              <option value="DRAFT">Dự thảo</option>
              <option value="EXPIRED">Hết hiệu lực</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Laws List */}
      {laws.length === 0 && !loading && !error && (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Không có văn bản pháp luật</h3>
          <p className="mt-1 text-sm text-gray-500">Không tìm thấy văn bản pháp luật nào theo tiêu chí đã chọn.</p>
        </div>
      )}

      {laws.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Tìm thấy {laws.length} văn bản pháp luật
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {laws.map((law) => (
              <div key={law.lawId} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {law.lawNumber || 'N/A'}
                      </h3>
                      {getStatusBadge(law.status)}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {law.description || 'Không có mô tả'}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>
                        <strong>Cơ quan ban hành:</strong> {law.issuingBody || 'N/A'}
                      </span>
                      <span>
                        <strong>Ngày ban hành:</strong> {formatDate(law.issueDate)}
                      </span>
                      <span>
                        <strong>Ngày hiệu lực:</strong> {formatDate(law.effectiveDate)}
                      </span>
                      {law.expiryDate && (
                        <span>
                          <strong>Ngày hết hiệu lực:</strong> {formatDate(law.expiryDate)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-4 flex-shrink-0">
                    <button
                      onClick={() => handleViewLaw(law.lawId)}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-colors"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LawsList;
