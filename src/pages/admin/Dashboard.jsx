import React, { useState, useEffect } from 'react';
import { Users, Package, Activity, LogOut, Home, BarChart3, FileText, TrendingUp, Bell } from 'lucide-react';
import UserManagement from './components/UserManagement';
import PackageManagement from './components/PackageManagement';
import UserPackageManagement from './components/UserPackageManagement';
import LawsManagement from './components/LawsManagement';
import { analyticsService } from './services/adminService';
import { authService } from '../../services/authService';
import ErrorNotification from '../../components/ErrorNotification';
import '../../components/ErrorNotification.css';
import './Dashboard.css';

// Enhanced Dashboard Overview Component
const DashboardOverview = ({ stats, loading, error, onRetry }) => {
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
        <ErrorNotification 
          error={error} 
          onRetry={onRetry}
          className="dashboard-error"
        />
      )}
    
      
      {/* Main Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats?.totalUsers || 0}</h3>
            <p>Tổng người dùng</p>
            <small>{stats?.activeUsers || 0} đang hoạt động</small>
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

        <div className="stat-card">
          <div className="stat-icon">
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats?.totalLaws || 0}</h3>
            <p>Văn bản pháp luật</p>
            <small>{stats?.activeLaws || 0} có hiệu lực</small>
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

      {error && (
        <div className="fallback-note">
          <p>Có lỗi kết nối API, vui lòng thử lại sau</p>
          <small>Cập nhật lần cuối: {new Date().toLocaleString('vi-VN')}</small>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardStats, setDashboardStats] = useState({});
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Load current user info
  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  // Navigation handlers
  const handleGoToHome = () => {
    window.location.href = '/';
  };

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      // Clear auth data using authService
      authService.logout();
      // Redirect to login or home
      window.location.href = '/auth';
    }
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
      
      setStatsError(null);
      
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
      setStatsError(err);
      
      // Set empty stats when API fails
      setDashboardStats({
        totalPackages: 0,
        activePackages: 0,
        totalSubscriptions: 0,
        activeSubscriptions: 0,
        expiredSubscriptions: 0,
        blockedSubscriptions: 0,
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
    { id: 'overview', label: 'Tổng quan', icon: BarChart3, component: () => <DashboardOverview stats={dashboardStats} loading={statsLoading} error={statsError} onRetry={loadDashboardStats} /> },
    { id: 'users', label: 'Quản lý Users', icon: Users, component: UserManagement },
    { id: 'packages', label: 'Quản lý Packages', icon: Package, component: PackageManagement },
    { id: 'user-packages', label: 'Quản lý Subscriptions', icon: Activity, component: UserPackageManagement },
    { id: 'laws', label: 'Quản lý Văn bản', icon: FileText, component: LawsManagement },
  ];

  const ActiveComponent = menuItems.find(item => item.id === activeTab)?.component || (() => <DashboardOverview stats={dashboardStats} loading={statsLoading} error={statsError} onRetry={loadDashboardStats} />);

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
