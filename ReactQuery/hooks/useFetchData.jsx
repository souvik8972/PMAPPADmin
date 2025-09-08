
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

export const useFetchData = (endpoint, token) => {
  // useRedirectIfTokenExpired(token)
  const {accessTokenGetter} = useContext(AuthContext);
  // console.log("Fetching data from:", endpoint);
// const randomNum = Math.floor(Math.random() * 1000); 
  // const accessToken = useRefreshToken(token,endpoint);
  // console.log("hhhhhh",accessToken,"TOKEN",token )
  // console.log("Access Token:", accessToken);
  return useQuery({
  queryKey: [endpoint, accessToken], 
   queryFn: async () => {
      // always refresh before fetch
      const accessToken = await accessTokenGetter();
      return fetchData({ endpoint, token: accessToken });
    },
  enabled: !!accessToken, 
  staleTime: 0,        
  refetchOnMount: true,
  refetchOnWindowFocus: true,
});

};