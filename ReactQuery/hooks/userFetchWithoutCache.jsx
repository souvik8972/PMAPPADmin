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

export const useFetchDataNoCache = (endpoint, token) => {
     useRedirectIfTokenExpired(token)
  return useQuery({
    queryKey: [endpoint],
    queryFn: () => fetchData({ endpoint, token }),
    enabled: !!token,
    staleTime: 0,     // Data is always considered stale
    cacheTime: 0,     // Don't keep in cache at all after unmount
    refetchOnMount: true, // Optional: ensures data is fetched on every mount
    refetchOnWindowFocus: true, // Optional: fetch again if user refocuses the window
  });
};
