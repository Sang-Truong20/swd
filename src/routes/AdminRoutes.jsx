import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../services/authService';

const AdminRoutes = () => {
  // Check if user is authenticated and is admin
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();

  // For development purposes, if no auth token exists, create a temporary one
  if (!isAuthenticated) {
    console.warn('No authentication found, creating temporary admin session for development');
    // Create temporary admin session for development
    authService.mockLogin({ username: 'admin', email: 'admin@example.com' });
  }

  const hasAdminAccess = isAuthenticated && isAdmin;

  console.log('🔐 Admin Route Check:', {
    isAuthenticated,
    isAdmin,
    hasAdminAccess,
    currentUser: authService.getCurrentUser()
  });

  return hasAdminAccess ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default AdminRoutes;
