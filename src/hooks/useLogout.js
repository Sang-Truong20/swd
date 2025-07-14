import { useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../constants';

const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logout = () => {
    localStorage.removeItem('userId');
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    queryClient.clear();
    navigate(PATH_NAME.AUTH);
  };

  return logout;
};

export { useLogout };
