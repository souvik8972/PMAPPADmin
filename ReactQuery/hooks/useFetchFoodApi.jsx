// useFetchData.js
import { API_URL } from '@env';
import { useQuery } from '@tanstack/react-query';

export const useFetchFoodApi = (url, token, options = {}) => {
  return useQuery({
    queryKey: [url],
    queryFn: async () => {
      const res = await fetch(`${API_URL}${url}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
    ...options, // 👈 important!
  });
};
