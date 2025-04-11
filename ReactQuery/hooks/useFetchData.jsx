
import { useQuery } from '@tanstack/react-query';

const fetchData = async ({ endpoint, token }) => {
  const response = await fetch(`http://184.72.156.185/Test-APp/api/${endpoint}`, {
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