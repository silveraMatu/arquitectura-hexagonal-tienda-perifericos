'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApiRequestError } from '@/lib/api/client';

const MAX_RETRIES = 2;

/** 4xx answers are definitive (not found, validation...): retrying them only delays the message. */
const shouldRetry = (failureCount: number, error: Error) =>
  failureCount < MAX_RETRIES &&
  !(error instanceof ApiRequestError && error.status >= 400 && error.status < 500);

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, retry: shouldRetry, refetchOnWindowFocus: true },
          mutations: { retry: false },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
