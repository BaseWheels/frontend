import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data selama 5 menit
      staleTime: 5 * 60 * 1000,

      // Keep data di cache selama 10 menit
      gcTime: 10 * 60 * 1000,

      // Refetch saat window focus
      refetchOnWindowFocus: true,

      // Retry 3x jika gagal
      retry: 3,

      // Retry delay dengan exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});
