import React from 'react';
import { AlertTriangle, Wifi, Key, Shield } from 'lucide-react';

const ErrorNotification = ({ error, onRetry, className = '' }) => {
  const getErrorIcon = () => {
    if (error?.response?.status === 403) return <Shield size={20} />;
    if (error?.response?.status === 401) return <Key size={20} />;
    if (error?.code === 'NETWORK_ERROR') return <Wifi size={20} />;
    return <AlertTriangle size={20} />;
  };

  const getErrorMessage = () => {
    if (error?.response?.status === 403) {
      return 'Không có quyền truy cập tài nguyên này';
    }
    if (error?.response?.status === 401) {
      return 'Phiên đăng nhập đã hết hạn';
    }
    if (error?.code === 'NETWORK_ERROR') {
      return 'Không thể kết nối đến server';
    }
    return error?.message || 'Đã xảy ra lỗi không xác định';
  };

  const getErrorType = () => {
    if (error?.response?.status === 403) return 'permission';
    if (error?.response?.status === 401) return 'auth';
    if (error?.code === 'NETWORK_ERROR') return 'network';
    return 'error';
  };

  return (
    <div className={`error-notification ${getErrorType()} ${className}`}>
      <div className="error-icon">
        {getErrorIcon()}
      </div>
      <div className="error-content">
        <h4>Lỗi tải dữ liệu</h4>
        <p>{getErrorMessage()}</p>
        {error?.response?.status === 403 && (
            <small>Vui lòng đăng nhập với tài khoản có quyền admin</small>
        )}
        {error?.response?.status === 401 && (
          <small>Vui lòng đăng nhập lại</small>
        )}
        {onRetry && (
          <button onClick={onRetry} className="retry-button">
            Thử lại
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorNotification;
