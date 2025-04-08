// src/hooks/usePostData.js
import { useMutation, useQueryClient } from '@tanstack/react-query';

const postData = async ({ endpoint, data, token }) => {
  const response = await fetch(`https://your-api.com/${endpoint}`, {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};

export const usePostData = (endpoint, invalidateQueries = []) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, token }) => postData({ endpoint, data, token }),
    onSuccess: () => {
      // Invalidate and refetch any queries you want to update
      invalidateQueries.forEach(queryKey => {
        queryClient.invalidateQueries([queryKey]);
      });
    },
  });
};