import { create } from 'zustand';

export interface ReservationData {
  id: string;
  userId: string;
  slotId: string;
  expiresAt: string; // ISO datetime string
  status: 'ACTIVE' | 'FULFILLED' | 'EXPIRED' | 'CANCELLED';
  createdAt: string;
  slot: {
    id: string;
    slotCode: string;
    zoneId: string;
    status: string;
    zone: {
      name: string;
    };
  };
}

interface ReservationState {
  activeReservation: ReservationData | null;
  setActiveReservation: (reservation: ReservationData | null) => void;
  clearReservation: () => void;
}

export const useReservationStore = create<ReservationState>((set) => ({
  activeReservation: null,
  setActiveReservation: (activeReservation) => set({ activeReservation }),
  clearReservation: () => set({ activeReservation: null }),
}));
