import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSlotStore } from '../store/slotStore';
import { useReservationStore } from '../store/reservationStore';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const updateSlotStatus = useSlotStore((state) => state.updateSlotStatus);
  const updateZoneStats = useSlotStore((state) => state.updateZoneStats);
  const { activeReservation, clearReservation } = useReservationStore();

  useEffect(() => {
    // Initialize Socket.io-client
    console.log('[Socket] Initializing real-time Socket connection...');
    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[Socket] Connected to backend! ID:', socket.id);
      
      // Join general campus updates
      socket.emit('join:campus');
    });

    // Handle single slot update
    socket.on('slot:update', (data: { slotId: string; status: any }) => {
      console.log('[Socket] Received slot:update:', data);
      updateSlotStatus(data.slotId, data.status);
    });

    // Handle zone stats update
    socket.on('zone:update', (data: any) => {
      console.log('[Socket] Received zone:update:', data);
      updateZoneStats(data);
    });

    // Handle active reservation expiration alert
    socket.on('reservation:expired', (data: { reservationId: string; slotId: string }) => {
      console.log('[Socket] Received reservation:expired:', data);
      if (activeReservation && activeReservation.id === data.reservationId) {
        clearReservation();
        
        // Push notification toast
        if (typeof window !== 'undefined' && 'Notification' in window) {
          if (Notification.permission === 'granted') {
            new Notification('ParkSense Booking Expired', {
              body: `Your 15-minute hold on slot ${activeReservation.slot.slotCode} has expired.`,
            });
          }
        }
      }
    });

    socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected from backend:', reason);
    });

    socket.on('connect_error', (error) => {
      console.warn('[Socket] Connection failed. Fallback or retry active:', error.message);
    });

    // Cleanup on unmount
    return () => {
      console.log('[Socket] Cleaning up Socket connections...');
      if (socket) {
        socket.disconnect();
      }
    };
  }, [updateSlotStatus, updateZoneStats, activeReservation, clearReservation]);

  return socketRef.current;
};
