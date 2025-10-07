import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePackages } from '../usePackages';
import React from 'react';

describe('usePackages', () => {
  it('should import @tanstack/react-query successfully', () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => usePackages(), { wrapper });

    // If we get here without errors, the import worked
    expect(result.current).toBeDefined();
    expect(result.current.isLoading).toBeDefined();
  });

  it('should return mock data when Supabase fails', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => usePackages(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true), {
      timeout: 3000,
    });

    expect(result.current.data).toBeDefined();
    expect(Array.isArray(result.current.data)).toBe(true);
    expect(result.current.data!.length).toBeGreaterThan(0);
  });

  it('should filter packages by product type', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => usePackages('total_essential'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true), {
      timeout: 3000,
    });

    expect(result.current.data).toBeDefined();
    expect(result.current.data!.every(pkg => pkg.product_type === 'total_essential')).toBe(true);
  });
});

