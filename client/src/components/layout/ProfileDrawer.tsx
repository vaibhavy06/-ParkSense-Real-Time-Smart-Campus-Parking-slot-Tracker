'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useProfileStore } from '../../store/profileStore';
import { apiFetch } from '../../utils/api';
import { X, User, Car, ShieldAlert, BadgeCheck } from 'lucide-react';
import RoleBadge from '../ui/RoleBadge';

export default function ProfileDrawer() {
  const { user, updateUser } = useAuthStore();
  const { isProfileOpen, setProfileOpen } = useProfileStore();

  const [name, setName] = useState(user?.name || '');
  const [vehicleNo, setVehicleNo] = useState(user?.vehicleNo || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setVehicleNo(user.vehicleNo || '');
    }
  }, [user]);

  if (!isProfileOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const updatedUser = await apiFetch('/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify({
          name: name.trim(),
          vehicleNo: vehicleNo.trim().toUpperCase(),
        }),
      });

      // Update zustand store state
      updateUser(updatedUser);
      setMessage({ type: 'success', text: '✅ Profile updated successfully!' });
      
      // Auto close after 1.5s
      setTimeout(() => {
        setProfileOpen(false);
        setMessage(null);
      }, 1500);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end no-print">
      {/* Backdrop */}
      <div
        onClick={() => setProfileOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
      />

      {/* Drawer Body */}
      <div className="relative w-full max-w-md h-full bg-bg-surface border-l border-glass-border shadow-2xl p-6 md:p-8 flex flex-col justify-between z-10 transition-transform duration-300">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-glass-border/40 pb-4">
            <h2 className="font-display font-black text-lg text-text-primary uppercase tracking-wider flex items-center space-x-2">
              <User className="w-5 h-5 text-accent" />
              <span>User Profile Settings</span>
            </h2>
            <button
              onClick={() => setProfileOpen(false)}
              className="p-1.5 rounded-lg bg-bg-card border border-glass-border hover:border-glass-border-hover text-text-secondary hover:text-text-primary transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Meta */}
          <div className="p-4 rounded-2xl bg-bg-card border border-glass-border/30 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-blue-700 border border-glass-border flex items-center justify-center text-white font-bold text-lg uppercase shadow shadow-blue-500/20">
              {user.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-black text-sm text-text-primary font-display flex items-center space-x-1.5">
                <span>{user.name}</span>
                <BadgeCheck className="w-4 h-4 text-accent fill-accent/20" />
              </h3>
              <p className="text-[10px] text-text-secondary font-mono leading-tight mt-0.5">{user.email}</p>
              <div className="mt-1 flex items-center space-x-2">
                <RoleBadge role={user.role} />
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center space-x-1">
                <User className="w-3.5 h-3.5" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-glass-border bg-bg-card text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-glow focus:border-accent font-semibold transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center space-x-1">
                <Car className="w-3.5 h-3.5" />
                <span>Vehicle Registration Plate (e.g. UP32AB1234)</span>
              </label>
              <input
                type="text"
                value={vehicleNo}
                onChange={(e) => setVehicleNo(e.target.value)}
                placeholder="NOT REGISTERED"
                className="w-full px-4 py-3 rounded-2xl border border-glass-border bg-bg-card text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-glow focus:border-accent font-mono font-bold uppercase tracking-wide transition-all"
              />
            </div>

            {message && (
              <div
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center space-x-2 ${
                  message.type === 'success'
                    ? 'bg-available/10 border-available/30 text-available'
                    : 'bg-occupied/10 border-occupied/30 text-occupied'
                }`}
              >
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>{message.text}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-accent text-white font-black text-xs uppercase tracking-widest shadow-md hover:bg-opacity-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] mt-4"
            >
              {isSubmitting ? 'Saving modifications...' : 'Save Settings'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-[10px] text-text-secondary text-center leading-relaxed font-bold uppercase tracking-wider">
          ParkSense Security Framework · AKTU Campuses
        </p>
      </div>
    </div>
  );
}
