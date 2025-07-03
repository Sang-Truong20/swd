import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const UserModal = ({ user, isEditing, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    name: '',
    password: '',
    avatarUrlText: '',
    birthday: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user && isEditing) {
      setFormData({
        userName: user.userName || '',
        email: user.email || '',
        name: user.name || '',
        password: '',
        avatarUrlText: user.avatarUrlText || '',
        birthday: user.birthday ? user.birthday.split('T')[0] : ''
      });
    }
  }, [user, isEditing]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userName.trim()) {
      newErrors.userName = 'Username là bắt buộc';
    } else if (formData.userName.length < 3) {
      newErrors.userName = 'Username phải có ít nhất 3 ký tự';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Tên đầy đủ là bắt buộc';
    }

    if (!isEditing && !formData.password.trim()) {
      newErrors.password = 'Password là bắt buộc';
    } else if (!isEditing && formData.password.length < 6) {
      newErrors.password = 'Password phải có ít nhất 6 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const userData = { ...formData };
      
      // Don't send empty password on edit
      if (isEditing && !userData.password) {
        delete userData.password;
      }

      // Convert birthday to proper format if provided
      if (userData.birthday) {
        userData.birthday = userData.birthday;
      }

      onSave(userData);
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
            {isEditing ? 'Chỉnh sửa User' : 'Thêm User mới'}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username *</label>
            <input
              type="text"
              name="userName"
              className={`form-input ${errors.userName ? 'error' : ''}`}
              value={formData.userName}
              onChange={handleChange}
              placeholder="Nhập username"
            />
            {errors.userName && <span className="error-message">{errors.userName}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              name="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Tên đầy đủ *</label>
            <input
              type="text"
              name="name"
              className={`form-input ${errors.name ? 'error' : ''}`}
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập tên đầy đủ"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">
              Password {!isEditing ? '*' : '(để trống nếu không đổi)'}
            </label>
            <input
              type="password"
              name="password"
              className={`form-input ${errors.password ? 'error' : ''}`}
              value={formData.password}
              onChange={handleChange}
              placeholder={isEditing ? "Nhập password mới (tùy chọn)" : "Nhập password"}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Avatar URL</label>
            <input
              type="url"
              name="avatarUrlText"
              className="form-input"
              value={formData.avatarUrlText}
              onChange={handleChange}
              placeholder="Nhập URL avatar (tùy chọn)"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Ngày sinh</label>
            <input
              type="date"
              name="birthday"
              className="form-input"
              value={formData.birthday}
              onChange={handleChange}
            />
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

export default UserModal;
