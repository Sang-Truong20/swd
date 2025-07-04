import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const PackageModal = ({ package: pkg, isEditing, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    dailyLimit: '',
    daysLimit: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (pkg && isEditing) {
      setFormData({
        name: pkg.name || '',
        description: pkg.description || '',
        price: pkg.price || '',
        dailyLimit: pkg.dailyLimit || '',
        daysLimit: pkg.daysLimit || ''
      });
    }
  }, [pkg, isEditing]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên gói là bắt buộc';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả là bắt buộc';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Giá phải lớn hơn 0';
    }

    if (!formData.dailyLimit || formData.dailyLimit <= 0) {
      newErrors.dailyLimit = 'Giới hạn hàng ngày phải lớn hơn 0';
    }

    if (!formData.daysLimit || formData.daysLimit <= 0) {
      newErrors.daysLimit = 'Số ngày hiệu lực phải lớn hơn 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const packageData = {
        ...formData,
        price: parseFloat(formData.price),
        dailyLimit: parseInt(formData.dailyLimit),
        daysLimit: parseInt(formData.daysLimit)
      };

      onSave(packageData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">
            {isEditing ? 'Chỉnh sửa Gói dịch vụ' : 'Thêm Gói dịch vụ mới'}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tên gói *</label>
            <input
              type="text"
              name="name"
              className={`form-input ${errors.name ? 'error' : ''}`}
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập tên gói dịch vụ"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Mô tả *</label>
            <textarea
              name="description"
              className={`form-textarea ${errors.description ? 'error' : ''}`}
              value={formData.description}
              onChange={handleChange}
              placeholder="Nhập mô tả chi tiết về gói dịch vụ"
              rows="4"
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Giá (VNĐ) *</label>
              <input
                type="number"
                name="price"
                className={`form-input ${errors.price ? 'error' : ''}`}
                value={formData.price}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="1000"
              />
              {errors.price && <span className="error-message">{errors.price}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Giới hạn hàng ngày *</label>
              <input
                type="number"
                name="dailyLimit"
                className={`form-input ${errors.dailyLimit ? 'error' : ''}`}
                value={formData.dailyLimit}
                onChange={handleChange}
                placeholder="Số lượt hỏi đáp/ngày"
                min="1"
              />
              {errors.dailyLimit && <span className="error-message">{errors.dailyLimit}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Thời hạn (ngày) *</label>
            <input
              type="number"
              name="daysLimit"
              className={`form-input ${errors.daysLimit ? 'error' : ''}`}
              value={formData.daysLimit}
              onChange={handleChange}
              placeholder="Số ngày hiệu lực"
              min="1"
            />
            {errors.daysLimit && <span className="error-message">{errors.daysLimit}</span>}
          </div>

          <div className="package-preview">
            <h4>Xem trước:</h4>
            <div className="preview-card">
              <h5>{formData.name || 'Tên gói'}</h5>
              <p>{formData.description || 'Mô tả gói dịch vụ'}</p>
              <div className="preview-details">
                <span>Giá: {formData.price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(formData.price) : '0 VNĐ'}</span>
                <span>Giới hạn: {formData.dailyLimit || '0'} lượt/ngày</span>
                <span>Thời hạn: {formData.daysLimit || '0'} ngày</span>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PackageModal;
