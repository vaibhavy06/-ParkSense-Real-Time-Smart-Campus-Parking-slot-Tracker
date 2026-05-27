import { create } from 'zustand';

export interface ZoneData {
  id: string;
  name: string;
  totalSlots: number;
  allowedRoles: string[];
  available: number;
  occupied: number;
  reserved: number;
  disabled: number;
}

export interface SlotData {
  id: string;
  slotCode: string;
  zoneId: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'DISABLED';
  x: number;
  y: number;
  isDisabled: boolean;
  zone: {
    name: string;
    allowedRoles: string[];
  };
}

interface SlotState {
  slots: SlotData[];
  zones: ZoneData[];
  isLoading: boolean;
  setSlots: (slots: SlotData[]) => void;
  setZones: (zones: ZoneData[]) => void;
  setLoading: (loading: boolean) => void;
  updateSlotStatus: (slotId: string, status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'DISABLED') => void;
  updateZoneStats: (zoneStats: { zoneId: string; available: number; occupied: number; reserved: number; disabled: number }) => void;
}

export const useSlotStore = create<SlotState>((set) => ({
  slots: [],
  zones: [],
  isLoading: false,
  setSlots: (slots) => set({ slots }),
  setZones: (zones) => set({ zones }),
  setLoading: (isLoading) => set({ isLoading }),
  
  // Real-time slot state and zone occupancy recalculation
  updateSlotStatus: (slotId, status) =>
    set((state) => {
      // Find the slot and update its status
      const updatedSlots = state.slots.map((s) =>
        s.id === slotId ? { ...s, status } : s
      );

      // Dynamically recalculate zone counts to keep side panels perfectly aligned
      const updatedZones = state.zones.map((zone) => {
        const zoneSlots = updatedSlots.filter((s) => s.zoneId === zone.id);
        const available = zoneSlots.filter((s) => s.status === 'AVAILABLE').length;
        const occupied = zoneSlots.filter((s) => s.status === 'OCCUPIED').length;
        const reserved = zoneSlots.filter((s) => s.status === 'RESERVED').length;
        const disabled = zoneSlots.filter((s) => s.status === 'DISABLED' || s.isDisabled).length;

        return {
          ...zone,
          available,
          occupied,
          reserved,
          disabled,
        };
      });

      return {
        slots: updatedSlots,
        zones: updatedZones,
      };
    }),

  // Directly update zone stats from socket broadcast
  updateZoneStats: (zoneStats) =>
    set((state) => ({
      zones: state.zones.map((z) =>
        z.id === zoneStats.zoneId
          ? {
              ...z,
              available: zoneStats.available,
              occupied: zoneStats.occupied,
              reserved: zoneStats.reserved,
              disabled: zoneStats.disabled,
            }
          : z
      ),
    })),
}));
