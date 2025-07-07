import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../constants';

const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userId');
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    navigate(PATH_NAME.AUTH);
  };

  return logout;
};

export { useLogout };
