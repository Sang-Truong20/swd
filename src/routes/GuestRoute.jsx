import { Navigate, Outlet } from 'react-router-dom';

const isAuthenticated = () => {
  return !!localStorage.getItem('accessToken');
};

const GuestRoute = () => {
  return isAuthenticated() ? <Navigate to="/" replace /> : <Outlet />;
};

export default GuestRoute;
