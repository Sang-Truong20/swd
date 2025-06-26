import { Navigate, Outlet } from 'react-router-dom';

const MemberRoutes = () => {
  const isMember = false;

  return isMember ? <Outlet /> : <Navigate to="/login" replace />;
};

export default MemberRoutes;
