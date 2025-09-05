import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Gig } from '@/lib/types';

interface UseGigsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  skills?: string[];
  vetted?: boolean;
}

export function useGigs(params: UseGigsParams = {}) {
  return useQuery({
    queryKey: ['gigs', params],
    queryFn: async () => {
      const response = await apiClient.getGigs(params);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch gigs');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateGig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (gigData: Partial<Gig>) => {
      const response = await apiClient.createGig(gigData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create gig');
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch gigs
      queryClient.invalidateQueries({ queryKey: ['gigs'] });
    },
  });
}

export function useSavedGigs() {
  return useQuery({
    queryKey: ['saved-gigs'],
    queryFn: async () => {
      const response = await apiClient.getCurrentUser();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch saved gigs');
      }
      return response.data?.saved_gigs || [];
    },
  });
}

export function useSaveGig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ gigId, action }: { gigId: string; action: 'save' | 'unsave' }) => {
      // This would typically call a save/unsave endpoint
      // For now, we'll simulate the action
      return { gigId, action };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-gigs'] });
    },
  });
}
