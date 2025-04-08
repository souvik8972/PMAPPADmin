
import { useQuery } from '@tanstack/react-query';

const fetchData = async ({ endpoint, token }) => {
  const response = await fetch(`https://your-api.com/${endpoint}`, {
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
  return useQuery({
    queryKey: [endpoint], // Unique key for caching
    queryFn: () => fetchData({ endpoint, token }),
    enabled: !!token, // Only fetch if token exists
  });
};