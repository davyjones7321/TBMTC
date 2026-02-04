import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 2,
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
            refetchOnMount: 'always',
            refetchOnWindowFocus: false, // No window on mobile
            refetchOnReconnect: true, // Important for mobile network changes
        },
        mutations: {
            retry: 1,
        },
    },
});
