import { create } from 'zustand';

interface ProfileState {
  isProfileOpen: boolean;
  setProfileOpen: (open: boolean) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  isProfileOpen: false,
  setProfileOpen: (isProfileOpen) => set({ isProfileOpen }),
}));
