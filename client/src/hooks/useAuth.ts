import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../utils/api';
import { useAuthStore, UserProfile } from '../store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setAuth, clearAuth, user, isAuthenticated } = useAuthStore();

  // Fetch current user details on initialization
  const meQuery = useQuery({
    queryKey: ['me'],
    queryFn: () => apiFetch('/auth/me'),
    enabled: isAuthenticated, // only query if we think we are logged in
    retry: false,
  });

  useEffect(() => {
    if (meQuery.error) {
      // Token probably expired, clear local state
      clearAuth();
    } else if (meQuery.data) {
      // Sync user data
      useAuthStore.getState().updateUser(meQuery.data);
    }
  }, [meQuery.data, meQuery.error, clearAuth]);

  // Login Mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: any) =>
      apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      queryClient.invalidateQueries({ queryKey: ['me'] });
      
      // Role-based redirection
      if (data.user.role === 'ADMIN') router.push('/admin');
      else if (data.user.role === 'GUARD') router.push('/guard');
      else router.push('/map');
    },
  });

  // Register Mutation
  const registerMutation = useMutation({
    mutationFn: (fields: any) =>
      apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(fields),
      }),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      queryClient.invalidateQueries({ queryKey: ['me'] });
      router.push('/map');
    },
  });

  // Logout Mutation
  const logoutMutation = useMutation({
    mutationFn: () =>
      apiFetch('/auth/logout', {
        method: 'POST',
      }),
    onSuccess: () => {
      clearAuth();
      queryClient.clear(); // Clear all cached data
      router.push('/login');
    },
  });

  return {
    user,
    isAuthenticated,
    isLoading: meQuery.isLoading,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error as Error | null,
    registerError: registerMutation.error as Error | null,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    refetchMe: meQuery.refetch,
  };
};
