import React, { useState, useEffect } from 'react';
import { Search, Shield, ShieldOff, Calendar, Package, User, DollarSign } from 'lucide-react';
import { Modal } from 'antd';
import { userPackageService } from '../services/adminService';
import { notify } from '../../../utils';

const UserPackageManagement = () => {
  const [userPackages, setUserPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Load user packages from API
  const loadUserPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      const userPackageData = await userPackageService.getAllUserPackages();
      setUserPackages(userPackageData || []);
    } catch (err) {
      console.error('Error loading user packages:', err);
      setError(err.message);
      setUserPackages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserPackages();
  }, []);

  const filteredUserPackages = (Array.isArray(userPackages) ? userPackages : []).filter(userPkg => {
    const matchesSearch = 
      (userPkg.userName || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
      (userPkg.packageName || '').toLowerCase().includes((searchTerm || '').toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || userPkg.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleBlockUserPackage = async (userPackageId) => {
    Modal.confirm({
      title: 'Xác nhận khóa gói đăng ký',
      content: 'Bạn có chắc chắn muốn khóa gói đăng ký này?',
      onOk: async () => {
        try {
          await userPackageService.blockUserPackage(userPackageId);
          await loadUserPackages(); // Reload data after action
          notify('success', { description: 'Gói đăng ký đã được khóa thành công!' });
        } catch (error) {
          console.error('Error blocking user package:', error);
          notify('error', { description: 'Có lỗi xảy ra khi khóa gói đăng ký: ' + error.message });
        }
      },
    });
  };

  const handleUnblockUserPackage = async (userPackageId) => {
    Modal.confirm({
      title: 'Xác nhận mở khóa gói đăng ký',
      content: 'Bạn có chắc chắn muốn mở khóa gói đăng ký này?',
      onOk: async () => {
        try {
          await userPackageService.unblockUserPackage(userPackageId);
          await loadUserPackages(); // Reload data after action
          notify('success', { description: 'Gói đăng ký đã được mở khóa thành công!' });
        } catch (error) {
          console.error('Error unblocking user package:', error);
          notify('error', { description: 'Có lỗi xảy ra khi mở khóa gói đăng ký: ' + error.message });
        }
      },
    });
  };

  const getStatusBadge = (status) => {
    if (!status) return <span className="status-badge">N/A</span>;
    switch (status) {
      case 'ACTIVE':
        return <span className="status-badge status-active">Đang hoạt động</span>;
      case 'EXPIRED':
        return <span className="status-badge status-expired">Hết hạn</span>;
      case 'BLOCKED':
        return <span className="status-badge status-blocked">Bị khóa</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  const getTransactionMethodBadge = (method) => {
    if (!method) return <span className="method-badge">N/A</span>;
    switch (method) {
      case 'VNPAY':
        return <span className="method-badge vnpay">VNPay</span>;
      case 'MOMO':
        return <span className="method-badge momo">Momo</span>;
      case 'ZALOPAY':
        return <span className="method-badge zalopay">ZaloPay</span>;
      default:
        return <span className="method-badge">{method}</span>;
    }
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return '0 VND';
    try {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price);
    } catch (error) {
      return `${price} VND`;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Ngày không hợp lệ';
    }
  };

  const isExpiringSoon = (expirationDate) => {
    if (!expirationDate) return false;
    try {
      const expDate = new Date(expirationDate);
      const now = new Date();
      const diffTime = expDate - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && diffDays > 0;
    } catch (error) {
      return false;
    }
  };

  const getStatusCounts = () => {
    const safeUserPackages = Array.isArray(userPackages) ? userPackages : [];
    return {
      all: safeUserPackages.length,
      active: safeUserPackages.filter(pkg => pkg.status === 'ACTIVE').length,
      expired: safeUserPackages.filter(pkg => pkg.status === 'EXPIRED').length,
      blocked: safeUserPackages.filter(pkg => pkg.status === 'BLOCKED').length,
      expiringSoon: safeUserPackages.filter(pkg => 
        pkg.status === 'ACTIVE' && isExpiringSoon(pkg.expirationDate)
      ).length
    };
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner">Đang tải dữ liệu gói đăng ký...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <div className="error-message">
          <p>Có lỗi xảy ra khi tải dữ liệu: {error}</p>
          <button onClick={loadUserPackages} className="btn btn-primary">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-package-management">
      {error && (
        <div className="alert alert-warning">
          <p>⚠️ Lỗi kết nối API: {error}</p>
          <p>Vui lòng kiểm tra kết nối mạng hoặc liên hệ admin hệ thống.</p>
          <button onClick={loadUserPackages} className="btn btn-primary" style={{marginTop: '10px'}}>
            🔄 Thử lại
          </button>
        </div>
      )}
      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Package size={24} />
          </div>
          <div className="stat-content">
            <h3>{statusCounts.all}</h3>
            <p>Tổng gói đăng ký</p>
          </div>
        </div>
        <div className="stat-card active">
          <div className="stat-icon">
            <User size={24} />
          </div>
          <div className="stat-content">
            <h3>{statusCounts.active}</h3>
            <p>Đang hoạt động</p>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <h3>{statusCounts.expiringSoon}</h3>
            <p>Sắp hết hạn</p>
          </div>
        </div>
        <div className="stat-card danger">
          <div className="stat-icon">
            <Shield size={24} />
          </div>
          <div className="stat-content">
            <h3>{statusCounts.blocked}</h3>
            <p>Bị khóa</p>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="data-table">
        <div className="table-header">
          <h3 className="table-title">Danh sách Gói đăng ký ({filteredUserPackages.length})</h3>
          <div className="table-actions">
            <select
              className="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="ACTIVE">Đang hoạt động</option>
              <option value="EXPIRED">Hết hạn</option>
              <option value="BLOCKED">Bị khóa</option>
            </select>
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm theo user hoặc gói..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Người dùng</th>
                <th>Gói dịch vụ</th>
                <th>Giá</th>
                <th>Giới hạn</th>
                <th>Ngày mua</th>
                <th>Ngày hết hạn</th>
                <th>Phương thức</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredUserPackages.map((userPkg) => (
                <tr key={userPkg.userPackageId} className={isExpiringSoon(userPkg.expirationDate) ? 'expiring-soon' : ''}>
                  <td>
                    <div className="user-info">
                      <User size={16} />
                      <span>{userPkg.userName || 'N/A'}</span>
                    </div>
                  </td>
                  <td>
                    <div className="package-info">
                      <strong>{userPkg.packageName || 'N/A'}</strong>
                    </div>
                  </td>
                  <td>
                    <strong className="package-price">
                      {formatPrice(userPkg.packagePrice || 0)}
                    </strong>
                  </td>
                  <td>
                    <div className="limit-info">
                      <span>{(userPkg.dailyLimit === 999 || userPkg.dailyLimit === null) ? 'Không giới hạn' : `${userPkg.dailyLimit || 0}/ngày`}</span>
                      <small>{userPkg.daysLimit || 0} ngày</small>
                    </div>
                  </td>
                  <td>{formatDate(userPkg.transactionDate)}</td>
                  <td>
                    <div className={`expiration-date ${isExpiringSoon(userPkg.expirationDate) ? 'expiring' : ''}`}>
                      {formatDate(userPkg.expirationDate)}
                      {isExpiringSoon(userPkg.expirationDate) && (
                        <small className="expiring-label">Sắp hết hạn</small>
                      )}
                    </div>
                  </td>
                  <td>
                    {getTransactionMethodBadge(userPkg.transactionMethod)}
                  </td>
                  <td>
                    {getStatusBadge(userPkg.status)}
                  </td>
                  <td>
                    <div className="action-buttons">
                      {userPkg.status === 'ACTIVE' ? (
                        <button
                          className="action-btn btn-warning"
                          onClick={() => handleBlockUserPackage(userPkg.userPackageId)}
                          title="Khóa gói đăng ký"
                        >
                          <Shield size={16} />
                        </button>
                      ) : userPkg.status === 'BLOCKED' ? (
                        <button
                          className="action-btn btn-success"
                          onClick={() => handleUnblockUserPackage(userPkg.userPackageId)}
                          title="Mở khóa gói đăng ký"
                        >
                          <ShieldOff size={16} />
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUserPackages.length === 0 && (
            <div className="empty-state">
              <Package size={48} />
              <p>Không tìm thấy gói đăng ký nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPackageManagement;
