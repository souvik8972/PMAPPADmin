import { useMutation, useQueryClient } from "@tanstack/react-query";

import { API_URL } from '@env';
// Example modification to usePostData hook
export function usePostDataParam(baseUrl, queryKeys) {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: async ({ url, data, token }) => {
        const response = await axios.post(url || baseUrl, data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        return response.data;
      },
      onSuccess: () => {
        queryKeys.forEach(key => {
          queryClient.invalidateQueries(key);
        });
      }
    });
  }