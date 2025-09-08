
import { useRedirectIfTokenExpired, useRefreshToken } from '@/utils/auth';
import { useQuery } from '@tanstack/react-query';

import { API_URL } from '@env';
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

const fetchData = async ({ endpoint, token }) => {
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};

export const useFetchData = (endpoint) => {
  const { accessTokenGetter } = useContext(AuthContext);

  return useQuery({
    queryKey: [endpoint],
    queryFn: async () => {
      const accessToken = await accessTokenGetter();
      return fetchData({ endpoint, token: accessToken });
    },
    enabled: true,      
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};