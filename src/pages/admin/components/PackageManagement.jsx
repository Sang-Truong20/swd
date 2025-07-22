import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Power, PowerOff, Package } from 'lucide-react';
import { Modal } from 'antd';
import PackageModal from './PackageModal';
import { packageService } from '../services/adminService';
import { notify } from '../../../utils';

const PackageManagement = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Load packages from API
  const loadPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      const packageData = await packageService.getAllPackages();
      setPackages(packageData || []);
    } catch (err) {
      console.error('Error loading packages:', err);
      setError(err.message);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const filteredPackages = (Array.isArray(packages) ? packages : []).filter(pkg =>
    (pkg.name || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
    (pkg.description || '').toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  const handleCreatePackage = () => {
    setSelectedPackage(null);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEditPackage = (pkg) => {
    setSelectedPackage(pkg);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleTogglePackage = async (packageId, currentStatus) => {
    const action = currentStatus ? 'vô hiệu hóa' : 'kích hoạt';
    Modal.confirm({
      title: `Xác nhận ${action} gói`,
      content: `Bạn có chắc chắn muốn ${action} gói này?`,
      onOk: async () => {
        try {
          if (currentStatus) {
            await packageService.disablePackage(packageId);
          } else {
            await packageService.enablePackage(packageId);
          }
          await loadPackages(); // Reload data after action
          notify('success', { description: `Gói đã được ${action} thành công!` });
        } catch (error) {
          console.error(`Error ${action} package:`, error);
          notify('error', { description: `Có lỗi xảy ra khi ${action} gói: ` + error.message });
        }
      },
    });
  };

  const handleSavePackage = async (packageData) => {
    try {
      if (isEditing) {
        // Update existing package
        await packageService.updatePackage(selectedPackage.usagePackageId, packageData);
        notify('success', { description: 'Gói đã được cập nhật thành công!' });
      } else {
        // Create new package
        await packageService.createPackage(packageData);
        notify('success', { description: 'Gói đã được tạo thành công!' });
      }
      await loadPackages(); // Reload data after action
      setShowModal(false);
    } catch (error) {
      console.error('Error saving package:', error);
      notify('error', { description: 'Có lỗi xảy ra khi lưu gói: ' + error.message });
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

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner">Đang tải dữ liệu gói dịch vụ...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <div className="error-message">
          <p>Có lỗi xảy ra khi tải dữ liệu: {error}</p>
          <button onClick={loadPackages} className="btn btn-primary">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="data-table">
      {error && (
        <div className="alert alert-warning">
          <p>⚠️ Lỗi kết nối API: {error}</p>
          <p>Vui lòng kiểm tra kết nối mạng hoặc liên hệ admin hệ thống.</p>
          <button onClick={loadPackages} className="btn btn-primary" style={{marginTop: '10px'}}>
            🔄 Thử lại
          </button>
        </div>
      )}
      <div className="table-header">
        <h3 className="table-title">Quản lý Gói dịch vụ ({filteredPackages.length})</h3>
        <div className="table-actions">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm gói dịch vụ..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={handleCreatePackage}>
            <Plus size={20} />
            Thêm gói mới
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Tên gói</th>
              <th>Mô tả</th>
              <th>Giá</th>
              <th>Giới hạn/ngày</th>
              <th>Thời hạn (ngày)</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredPackages.map((pkg) => (
              <tr key={pkg.usagePackageId}>
                <td>
                  <div className="package-info">
                    <Package size={16} />
                    <span className="package-name">{pkg.name || 'N/A'}</span>
                  </div>
                </td>
                <td>
                  <div className="package-description">
                    {pkg.description || 'Không có mô tả'}
                  </div>
                </td>
                <td>
                  <strong className="package-price">
                    {formatPrice(pkg.price || 0)}
                  </strong>
                </td>
                <td>
                  <span className="limit-badge">
                    {(pkg.dailyLimit === 999 || pkg.dailyLimit === null) ? 'Không giới hạn' : `${pkg.dailyLimit || 0} lượt`}
                  </span>
                </td>
                <td>
                  <span className="days-badge">
                    {pkg.daysLimit || 0} ngày
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${pkg.isEnable ? 'status-active' : 'status-inactive'}`}>
                    {pkg.isEnable ? 'Đang hoạt động' : 'Đã vô hiệu hóa'}
                  </span>
                </td>
                <td>{formatDate(pkg.createdDate)}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-btn btn-secondary"
                      onClick={() => handleEditPackage(pkg)}
                      title="Chỉnh sửa"
                    >
                      <Edit size={16} />
                    </button>
                    {pkg.isEnable ? (
                      <button
                        className="action-btn btn-danger"
                        onClick={() => handleTogglePackage(pkg.usagePackageId, pkg.isEnable)}
                        title="Vô hiệu hóa"
                      >
                        <PowerOff size={16} />
                      </button>
                    ) : (
                      <button
                        className="action-btn btn-success"
                        onClick={() => handleTogglePackage(pkg.usagePackageId, pkg.isEnable)}
                        title="Kích hoạt"
                      >
                        <Power size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPackages.length === 0 && (
          <div className="empty-state">
            <Package size={48} />
            <p>Không tìm thấy gói dịch vụ nào</p>
          </div>
        )}
      </div>

      {showModal && (
        <PackageModal
          package={selectedPackage}
          isEditing={isEditing}
          onSave={handleSavePackage}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default PackageManagement;
