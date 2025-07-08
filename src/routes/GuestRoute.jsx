import Cookies from 'js-cookie';
import { Navigate, Outlet } from 'react-router-dom';

const isAuthenticated = () => {
  return !!Cookies.get('accessToken');
};

const GuestRoute = () => {
  return isAuthenticated() ? <Navigate to="/" replace /> : <Outlet />;
};

export default GuestRoute;
