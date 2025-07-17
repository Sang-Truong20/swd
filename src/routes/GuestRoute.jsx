import Cookies from 'js-cookie';
import { Outlet } from 'react-router-dom';

const GuestRoute = () => {
  // Cho phép truy cập trang auth ngay cả khi đã đăng nhập
  // để user có thể đăng nhập tài khoản khác
  return <Outlet />;
};

export default GuestRoute;
