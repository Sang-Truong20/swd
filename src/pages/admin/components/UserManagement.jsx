import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Shield, ShieldOff, User } from 'lucide-react';
import UserModal from './UserModal';
import { userService } from '../services/adminService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Load users from API
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await userService.getAllUsers();
      setUsers(userData || []);
    } catch (err) {
      console.error('Error loading users:', err);
      setError(err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = (Array.isArray(users) ? users : []).filter(user =>
    (user.userName || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
    (user.email || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
    (user.name || '').toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleBlockUser = async (userId) => {
    if (window.confirm('Bạn có chắc chắn muốn block user này?')) {
      try {
        await userService.blockUser(userId);
        await loadUsers(); // Reload data after action
        alert('User đã được block thành công!');
      } catch (error) {
        console.error('Error blocking user:', error);
        alert('Có lỗi xảy ra khi block user: ' + error.message);
      }
    }
  };

  const handleUnblockUser = async (userId) => {
    if (window.confirm('Bạn có chắc chắn muốn unblock user này?')) {
      try {
        await userService.unblockUser(userId);
        await loadUsers(); // Reload data after action
        alert('User đã được unblock thành công!');
      } catch (error) {
        console.error('Error unblocking user:', error);
        alert('Có lỗi xảy ra khi unblock user: ' + error.message);
      }
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      if (isEditing) {
        // Update existing user
        await userService.updateUser(selectedUser.userId, userData);
        alert('User đã được cập nhật thành công!');
      } else {
        // Create new user
        await userService.createUser(userData);
        alert('User đã được tạo thành công!');
      }
      await loadUsers(); // Reload data after action
      setShowModal(false);
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Có lỗi xảy ra khi lưu user: ' + error.message);
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
        <div className="spinner">Đang tải dữ liệu users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <div className="error-message">
          <p>Có lỗi xảy ra khi tải dữ liệu: {error}</p>
          <button onClick={loadUsers} className="btn btn-primary">
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
          <button onClick={loadUsers} className="btn btn-primary" style={{marginTop: '10px'}}>
            🔄 Thử lại
          </button>
        </div>
      )}
      <div className="table-header">
        <h3 className="table-title">Danh sách Users ({filteredUsers.length})</h3>
        <div className="table-actions">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm user..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={handleCreateUser}>
            <Plus size={20} />
            Thêm User
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Tên đầy đủ</th>
              <th>Role</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Ngày cập nhật</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.userId}>
                <td>
                  <div className="user-info">
                    <User size={16} />
                    <span>{user.userName || 'N/A'}</span>
                  </div>
                </td>
                <td>{user.email || 'N/A'}</td>
                <td>{user.name || 'N/A'}</td>
                <td>
                  <span className={`status-badge ${user.role === 'ADMIN' ? 'status-admin' : 'status-user'}`}>
                    {user.role || 'USER'}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${user.isActive ? 'status-active' : 'status-inactive'}`}>
                    {user.isActive ? 'Hoạt động' : 'Bị khóa'}
                  </span>
                </td>
                <td>{formatDate(user.createdDate)}</td>
                <td>{formatDate(user.updateDate)}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-btn btn-secondary"
                      onClick={() => handleEditUser(user)}
                      title="Chỉnh sửa"
                    >
                      <Edit size={16} />
                    </button>
                    {user.isActive ? (
                      <button
                        className="action-btn btn-warning"
                        onClick={() => handleBlockUser(user.userId)}
                        title="Block user"
                      >
                        <Shield size={16} />
                      </button>
                    ) : (
                      <button
                        className="action-btn btn-success"
                        onClick={() => handleUnblockUser(user.userId)}
                        title="Unblock user"
                      >
                        <ShieldOff size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="empty-state">
            <User size={48} />
            <p>Không tìm thấy user nào</p>
          </div>
        )}
      </div>

      {showModal && (
        <UserModal
          user={selectedUser}
          isEditing={isEditing}
          onSave={handleSaveUser}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default UserManagement;
