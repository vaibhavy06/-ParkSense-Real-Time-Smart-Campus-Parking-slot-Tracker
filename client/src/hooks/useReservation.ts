import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../utils/api';
import { useReservationStore } from '../store/reservationStore';
import { useEffect } from 'react';

export const useReservation = () => {
  const queryClient = useQueryClient();
  const { activeReservation, setActiveReservation, clearReservation } = useReservationStore();

  // Fetch active reservation on load
  const mineQuery = useQuery({
    queryKey: ['activeReservation'],
    queryFn: () => apiFetch('/reservations/mine'),
    retry: 1,
  });

  useEffect(() => {
    if (mineQuery.data !== undefined) {
      setActiveReservation(mineQuery.data);
    }
  }, [mineQuery.data, setActiveReservation]);

  // Create booking hold mutation
  const reserveMutation = useMutation({
    mutationFn: (slotId: string) =>
      apiFetch('/reservations', {
        method: 'POST',
        body: JSON.stringify({ slotId }),
      }),
    onSuccess: (data) => {
      setActiveReservation(data.reservation);
      // Invalidate related lists so we pull updated database states
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      queryClient.invalidateQueries({ queryKey: ['zones'] });
      queryClient.invalidateQueries({ queryKey: ['activeReservation'] });
    },
  });

  // Cancel hold mutation
  const cancelMutation = useMutation({
    mutationFn: (reservationId: string) =>
      apiFetch(`/reservations/${reservationId}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      clearReservation();
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      queryClient.invalidateQueries({ queryKey: ['zones'] });
      queryClient.invalidateQueries({ queryKey: ['activeReservation'] });
    },
  });

  return {
    activeReservation,
    isLoading: mineQuery.isLoading,
    isReserving: reserveMutation.isPending,
    isCancelling: cancelMutation.isPending,
    reserveError: reserveMutation.error as Error | null,
    cancelError: cancelMutation.error as Error | null,
    reserveSlot: reserveMutation.mutateAsync,
    cancelReservation: cancelMutation.mutateAsync,
    refetchReservation: mineQuery.refetch,
  };
};
