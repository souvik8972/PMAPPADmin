import { QueryClient } from '@tanstack/react-query';

export default queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // These are default options that work well for mobile
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 2, // Will retry failed queries 2 times before displaying an error
      // Network mode is good for mobile to handle flaky connections
      networkMode: 'online',
    },
  },
});