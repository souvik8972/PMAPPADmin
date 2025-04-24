// src/hooks/usePostData.js
import { useMutation, useQueryClient } from '@tanstack/react-query';

const postData = async ({ endpoint, data, token, queryParams = {} }) => {
  const queryString = new URLSearchParams(queryParams).toString();
  const fullUrl = `http://184.72.156.185/Test-APp/api/${endpoint}?${queryString}`;
  console.log(fullUrl, "Response status:");

  const response = await fetch(fullUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data), // or `null` if body not needed
  });

  if (!response.ok) {
    const errMsg = await response.text(); // <-- Add this for debugging
    throw new Error(`API Error: ${response.status} - ${errMsg}`);
  }

  return response.json();
};


export const usePostData = (endpoint, invalidateQueries = []) => {
  const queryClient = useQueryClient();

 // ✅ Pass queryParams through mutationFn
return useMutation({
  mutationFn: ({ data, token, queryParams }) =>
    postData({ endpoint, data, token, queryParams }),

  onSuccess: () => {
    invalidateQueries.forEach(queryKey => {
      queryClient.invalidateQueries([queryKey]);
    });
  },
});

};