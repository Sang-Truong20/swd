import { Spin } from 'antd';
import { Navigate, Outlet } from 'react-router-dom';
import { PATH_NAME } from '../constants';
import { useUserData } from '../hooks/useUserData';

const AdminRoutes = () => {
  const { userInfo, isLoading } = useUserData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  const isAdmin = userInfo && userInfo.role === 'ADMIN';

  return isAdmin ? <Outlet /> : <Navigate to={PATH_NAME.NOT_FOUND} replace />;
};

export default AdminRoutes;
