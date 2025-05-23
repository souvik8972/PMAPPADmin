
import { useRedirectIfTokenExpired } from '@/utils/auth';
import { useQuery } from '@tanstack/react-query';

import { API_URL } from '@env';

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

export const useFetchData = (endpoint, token) => {
  useRedirectIfTokenExpired(token)
  return useQuery({
    queryKey: [endpoint], // Unique key for caching
    queryFn: () => fetchData({ endpoint, token }),
    enabled: !!token, // Only fetch if token exists
    staleTime: 60 * 1000, // 1 minute (data stays fresh for 1 min)
    cacheTime: 1 * 60 * 1000, // Optional: Keep data in cache for 1 mins (default)

  });
};