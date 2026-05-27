import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../utils/api';
import { useSlotStore } from '../store/slotStore';
import { useEffect } from 'react';

export const useSlots = () => {
  const { setSlots, setZones, setLoading } = useSlotStore();

  const slotsQuery = useQuery({
    queryKey: ['slots'],
    queryFn: () => apiFetch('/slots'),
    refetchInterval: 30000, // Background poll every 30s as a fallback
  });

  const zonesQuery = useQuery({
    queryKey: ['zones'],
    queryFn: () => apiFetch('/zones'),
    refetchInterval: 30000,
  });

  const isLoading = slotsQuery.isLoading || zonesQuery.isLoading;

  useEffect(() => {
    setLoading(isLoading);
    if (slotsQuery.data) setSlots(slotsQuery.data);
    if (zonesQuery.data) setZones(zonesQuery.data);
  }, [slotsQuery.data, zonesQuery.data, isLoading, setSlots, setZones, setLoading]);

  return {
    slots: slotsQuery.data || [],
    zones: zonesQuery.data || [],
    isLoading,
    isError: slotsQuery.isError || zonesQuery.isError,
    refetch: () => {
      slotsQuery.refetch();
      zonesQuery.refetch();
    },
  };
};
