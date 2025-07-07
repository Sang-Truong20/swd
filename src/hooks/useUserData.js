import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { me } from '../services/auth';

export const useUserData = () => {
  const userId = localStorage.getItem('userId');
  const token = Cookies.get('accessToken');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['userData', userId],
    queryFn: () => me(userId),
    enabled: !!userId && !!token,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const userInfo = data?.data ?? null;

  return { userInfo, isLoading, error, refetch };
};
