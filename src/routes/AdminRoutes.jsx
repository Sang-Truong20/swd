import { Navigate, Outlet } from 'react-router-dom';

const AdminRoutes = () => {
  const isAdmin = false;

  return isAdmin ? <Outlet /> : <Navigate to='/login' replace />;
};

export default AdminRoutes;
