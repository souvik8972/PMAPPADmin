
import { useQuery } from '@tanstack/react-query';
import { useRedirectIfTokenExpired } from '../../utils/auth';


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

export const useFetchOnClick = (endpoint, token,check=false) => {
   useRedirectIfTokenExpired(token)
  return useQuery({
    queryKey: [endpoint], // Unique key for caching
    queryFn: () => fetchData({ endpoint, token }),
    enabled: check, 
    staleTime: 60 * 1000, // 1 minute (data stays fresh for 1 min)
    cacheTime: 1 * 60 * 1000, // Optional: Keep data in cache for 1 mins (default)

  });
};