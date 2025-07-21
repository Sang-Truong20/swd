import React, { useState, useEffect } from 'react';
import { Users, Package, Activity, LogOut, Home, BarChart3, FileText, Tag } from 'lucide-react';
import { Modal } from 'antd';
import UserManagement from './components/UserManagement';
import PackageManagement from './components/PackageManagement';
import UserPackageManagement from './components/UserPackageManagement';
import LawsManagement from './components/LawsManagement';
import LawTypeManagement from './components/LawTypeManagement';
import { analyticsService } from './services/adminService';
import { notify } from '../../utils';
import './Dashboard.css';

// Dashboard Overview Component
const DashboardOverview = ({ stats, loading, error }) => {
  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner">Đang tải thống kê...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-overview">
      <h2>Tổng quan hệ thống</h2>
      
      {error && (
        <div className="alert alert-warning">
          <p>⚠️ Cảnh báo: {error}</p>
          <p>Một số dữ liệu có thể không hiển thị do lỗi kết nối API.</p>
        </div>
      )}
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats?.totalLaws || 0}</h3>
            <p>Tổng văn bản pháp luật</p>
            <small>{stats?.validLaws || 0} đang có hiệu lực</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Package size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats?.totalPackages || 0}</h3>
            <p>Tổng gói dịch vụ</p>
            <small>{stats?.activePackages || 0} đang hoạt động</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Activity size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats?.totalSubscriptions || 0}</h3>
            <p>Tổng đăng ký</p>
            <small>{stats?.activeSubscriptions || 0} đang hoạt động</small>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">
            <Activity size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats?.expiredSubscriptions || 0}</h3>
            <p>Đăng ký hết hạn</p>
            <small>{stats?.expiringSoon || 0} sắp hết hạn</small>
          </div>
        </div>

        <div className="stat-card danger">
          <div className="stat-icon">
            <Activity size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats?.blockedSubscriptions || 0}</h3>
            <p>Đăng ký bị khóa</p>
          </div>
        </div>
      </div>

      <div className="recent-activities">
        <h3>Hoạt động gần đây</h3>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">
              <Users size={16} />
            </div>
            <div className="activity-content">
              <p>
                {error 
                  ? 'Có lỗi kết nối API, một số dữ liệu có thể không chính xác' 
                  : 'Hệ thống đang hoạt động bình thường'
                }
              </p>
              <small>Cập nhật lần cuối: {new Date().toLocaleString('vi-VN')}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardStats, setDashboardStats] = useState({});
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  // Navigation handlers
  const handleGoToHome = () => {
    window.location.href = '/';
  };

  const handleLogout = () => {
    Modal.confirm({
      title: 'Xác nhận đăng xuất',
      content: 'Bạn có chắc chắn muốn đăng xuất?',
      onOk: () => {
        // Clear any stored auth data
        localStorage.removeItem('authToken');
        sessionStorage.clear();
        notify('success', { description: 'Đăng xuất thành công!' });
        // Redirect to login or home
        setTimeout(() => {
          window.location.href = '/auth';
        }, 1000);
      },
    });
  };

  // Load dashboard statistics
  const loadDashboardStats = async () => {
    try {
      setStatsLoading(true);
      setStatsError(null);
      
      const stats = await analyticsService.getDashboardStats();
      
      setDashboardStats(stats || {
        totalPackages: 0,
        activePackages: 0,
        totalSubscriptions: 0,
        activeSubscriptions: 0,
        expiredSubscriptions: 0,
        blockedSubscriptions: 0,
        expiringSoon: 0
      });
      
      // Clear error if successful
      setStatsError(null);
      
    } catch (err) {
      console.error('❌ Error loading dashboard stats:', err);
      setStatsError(err.message || 'Không thể tải thống kê');
      
      // Set fallback stats
      setDashboardStats({
        totalPackages: 4,
        activePackages: 3,
        totalSubscriptions: 4,
        activeSubscriptions: 2,
        expiredSubscriptions: 1,
        blockedSubscriptions: 1,
        expiringSoon: 0
      });
      
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const menuItems = [
    { id: 'overview', label: 'Tổng quan', icon: BarChart3, component: () => <DashboardOverview stats={dashboardStats} loading={statsLoading} error={statsError} /> },
    { id: 'laws', label: 'Quản lý Văn bản', icon: FileText, component: LawsManagement },
    { id: 'law-types', label: 'Loại Văn bản', icon: Tag, component: LawTypeManagement },
    { id: 'users', label: 'Quản lý Users', icon: Users, component: UserManagement },
    { id: 'packages', label: 'Quản lý Packages', icon: Package, component: PackageManagement },
    { id: 'user-packages', label: 'Quản lý Subscriptions', icon: Activity, component: UserPackageManagement },
  ];

  const ActiveComponent = menuItems.find(item => item.id === activeTab)?.component || (() => <DashboardOverview stats={dashboardStats} loading={statsLoading} error={statsError} />);

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Admin Dashboard</h2>
          <p>SmartLawGT</p>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button 
            className="nav-item"
            onClick={handleGoToHome}
            title="Về trang chủ"
          >
            <Home size={20} />
            <span>Về trang chủ</span>
          </button>
          <button 
            className="nav-item logout"
            onClick={handleLogout}
            title="Đăng xuất khỏi hệ thống"
          >
            <LogOut size={20} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-header">
          <h1>{menuItems.find(item => item.id === activeTab)?.label}</h1>
        </div>
        
        <div className="content-body">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
