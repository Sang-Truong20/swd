import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import lawsService from '../../services/laws';

const LawDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [law, setLaw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchLawDetail();
    }
  }, [id]);

  const fetchLawDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await lawsService.getLawById(id);
      setLaw(response.data);
    } catch (err) {
      console.error('Error fetching law detail:', err);
      setError('Không thể tải chi tiết văn bản pháp luật. Vui lòng thử lại sau.');
      setLaw(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
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
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${config.class}`}>
        {config.label}
      </span>
    );
  };

  const handleViewContent = () => {
    if (law?.contentUrl) {
      window.open(law.contentUrl, '_blank');
    }
  };

  const handleGoBack = () => {
    navigate('/laws');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Đang tải chi tiết văn bản pháp luật...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">Lỗi tải dữ liệu</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={handleGoBack}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 transition-colors"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!law) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Không tìm thấy văn bản pháp luật</h3>
          <p className="mt-1 text-sm text-gray-500">Văn bản pháp luật với ID {id} không tồn tại.</p>
          <div className="mt-6">
            <button
              onClick={handleGoBack}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={handleGoBack}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Quay lại danh sách
        </button>
      </div>

      {/* Law Detail */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {law.lawNumber || 'N/A'}
              </h1>
              <p className="text-blue-100 text-lg">
                {law.lawType?.name || 'Loại văn bản không xác định'}
              </p>
            </div>
            <div className="ml-4">
              {getStatusBadge(law.status)}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Cơ quan ban hành</h3>
                <p className="mt-1 text-lg text-gray-900">{law.issuingBody || 'N/A'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Ngày ban hành</h3>
                <p className="mt-1 text-lg text-gray-900">{formatDate(law.issueDate)}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Ngày có hiệu lực</h3>
                <p className="mt-1 text-lg text-gray-900">{formatDate(law.effectiveDate)}</p>
              </div>
            </div>

            <div className="space-y-4">
              {law.expiryDate && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Ngày hết hiệu lực</h3>
                  <p className="mt-1 text-lg text-gray-900">{formatDate(law.expiryDate)}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Người tạo</h3>
                <p className="mt-1 text-lg text-gray-900">
                  {law.createdBy?.name || law.createdBy?.userName || 'N/A'}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Trạng thái hiện tại</h3>
                <div className="mt-1">
                  {getStatusBadge(law.status)}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {law.description && (
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Mô tả</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed">{law.description}</p>
              </div>
            </div>
          )}

          {/* Content URL */}
          {law.contentUrl && (
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Nội dung văn bản</h3>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-blue-700 mb-3">
                  Để xem toàn bộ nội dung văn bản pháp luật, vui lòng truy cập link bên dưới:
                </p>
                <button
                  onClick={handleViewContent}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Xem nội dung đầy đủ
                </button>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin bổ sung</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-500">ID văn bản:</span>
                <p className="text-gray-900">{law.lawId}</p>
              </div>
              {law.lawType && (
                <div>
                  <span className="font-medium text-gray-500">Loại văn bản:</span>
                  <p className="text-gray-900">{law.lawType.name}</p>
                </div>
              )}
              <div>
                <span className="font-medium text-gray-500">Trạng thái:</span>
                <p className="text-gray-900">{law.status}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawDetail;
