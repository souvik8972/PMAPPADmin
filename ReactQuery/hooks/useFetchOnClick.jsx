
import { useQuery } from '@tanstack/react-query';
import { useRedirectIfTokenExpired, useRefreshToken } from '../../utils/auth';

import { API_URL } from '@env';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

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

export const useFetchOnClick = (endpoint, token,check=false) => {
 const { accessTokenGetter } = useContext(AuthContext);

  return useQuery({
    queryKey: [endpoint], // Unique key for caching
    queryFn: async () => {
      const accessToken = await accessTokenGetter();
      return fetchData({ endpoint, token: accessToken });
    },
    enabled: true,  
    staleTime: 60 * 1000, // 1 minute (data stays fresh for 1 min)
    cacheTime: 1 * 60 * 1000, // Optional: Keep data in cache for 1 mins (default)

  });
};