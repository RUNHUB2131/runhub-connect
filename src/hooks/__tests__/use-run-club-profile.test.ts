
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useRunClubProfile } from '../use-run-club-profile';
import { api } from '@/api/client';
import { showErrorToast } from '@/utils/error-handling';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock dependencies
vi.mock('@/api/client', () => ({
  api: {
    runclubs: {
      fetchRunClubProfile: vi.fn()
    }
  }
}));

vi.mock('@/utils/error-handling', () => ({
  showErrorToast: vi.fn(),
  showSuccessToast: vi.fn()
}));

// Setup wrapper for React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useRunClubProfile', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  it('should return loading state when fetching profile', async () => {
    // Arrange
    const mockProfileId = 'profile-123';
    const mockProfile = { id: 'profile-123', club_name: 'Test Club' };
    
    vi.mocked(api.runclubs.fetchRunClubProfile).mockResolvedValue({
      data: mockProfile,
      error: null,
      success: true
    } as any);
    
    // Act
    const { result } = renderHook(() => useRunClubProfile(mockProfileId), {
      wrapper: createWrapper()
    });
    
    // Assert
    expect(result.current.isLoading).toBe(true);
    
    // Wait for the query to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.profile).toEqual(mockProfile);
    expect(result.current.error).toBeNull();
  });
  
  it('should handle error when profile fetch fails', async () => {
    // Arrange
    const mockProfileId = 'profile-123';
    const errorMessage = 'Failed to fetch profile';
    
    vi.mocked(api.runclubs.fetchRunClubProfile).mockResolvedValue({
      data: null,
      error: errorMessage,
      success: false
    } as any);
    
    // Act
    const { result } = renderHook(() => useRunClubProfile(mockProfileId), {
      wrapper: createWrapper()
    });
    
    // Wait for the query to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    // Assert
    expect(result.current.profile).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(Error);
    expect(showErrorToast).toHaveBeenCalled();
  });
  
  it('should not fetch when profileId is null or undefined', async () => {
    // Act
    const { result } = renderHook(() => useRunClubProfile(null), {
      wrapper: createWrapper()
    });
    
    // Assert
    expect(result.current.isLoading).toBe(false);
    expect(api.runclubs.fetchRunClubProfile).not.toHaveBeenCalled();
  });
  
  it('should refetch when calling refetch method', async () => {
    // Arrange
    const mockProfileId = 'profile-123';
    const mockProfile = { id: 'profile-123', club_name: 'Test Club' };
    
    vi.mocked(api.runclubs.fetchRunClubProfile).mockResolvedValue({
      data: mockProfile,
      error: null,
      success: true
    } as any);
    
    // Act
    const { result } = renderHook(() => useRunClubProfile(mockProfileId), {
      wrapper: createWrapper()
    });
    
    // Wait for initial query to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    // Reset mock to track new calls
    vi.mocked(api.runclubs.fetchRunClubProfile).mockClear();
    
    // Call refetch
    result.current.refetch();
    
    // Assert
    expect(result.current.isLoading).toBe(true);
    
    // Wait for refetch to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    // Should have been called again
    expect(api.runclubs.fetchRunClubProfile).toHaveBeenCalledTimes(1);
  });
});
