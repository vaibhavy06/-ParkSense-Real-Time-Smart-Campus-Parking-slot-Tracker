import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../utils/api';

export const useAnalytics = () => {
  const occupancyQuery = useQuery({
    queryKey: ['analytics', 'occupancy'],
    queryFn: () => apiFetch('/analytics/occupancy'),
    refetchInterval: 60000, // Refresh every 60s
  });

  const peakQuery = useQuery({
    queryKey: ['analytics', 'peak'],
    queryFn: () => apiFetch('/analytics/peak'),
    refetchInterval: 60000,
  });

  const trendsQuery = useQuery({
    queryKey: ['analytics', 'trends'],
    queryFn: () => apiFetch('/analytics/trends'),
    refetchInterval: 60000,
  });

  const zonesQuery = useQuery({
    queryKey: ['analytics', 'zones'],
    queryFn: () => apiFetch('/analytics/zones'),
    refetchInterval: 60000,
  });

  const isLoading =
    occupancyQuery.isLoading ||
    peakQuery.isLoading ||
    trendsQuery.isLoading ||
    zonesQuery.isLoading;

  const isError =
    occupancyQuery.isError ||
    peakQuery.isError ||
    trendsQuery.isError ||
    zonesQuery.isError;

  return {
    occupancyData: occupancyQuery.data || [],
    peakData: peakQuery.data || [],
    trendsData: trendsQuery.data || [],
    zonesData: zonesQuery.data || [],
    isLoading,
    isError,
    refetchAll: () => {
      occupancyQuery.refetch();
      peakQuery.refetch();
      trendsQuery.refetch();
      zonesQuery.refetch();
    },
  };
};
