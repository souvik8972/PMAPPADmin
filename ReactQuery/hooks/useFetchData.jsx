
import { useRedirectIfTokenExpired, useRefreshToken } from '@/utils/auth';
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
  // useRedirectIfTokenExpired(token)
  
  // console.log("Fetching data from:", endpoint);
// const randomNum = Math.floor(Math.random() * 1000); 
  const accessToken = useRefreshToken(token,endpoint);
  // console.log("hhhhhh",accessToken,"TOKEN",token )
  // console.log("Access Token:", accessToken);
  return useQuery({
    queryKey: [endpoint+"1"], // Unique key for caching
   queryFn: async () => {
    
      return fetchData({ endpoint, token: accessToken });
    },
    enabled: !!accessToken, // Only fetch if token exists
   staleTime: 0,       // Data is always stale → always refetch
  cacheTime: 0,       // No cache kept at all
  refetchOnMount: true,
  refetchOnWindowFocus: true,

  });
};