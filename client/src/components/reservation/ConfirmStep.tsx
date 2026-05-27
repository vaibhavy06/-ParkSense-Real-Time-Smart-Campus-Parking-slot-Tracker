'use client';

import React, { useState } from 'react';
import { SlotData } from '../../store/slotStore';
import { useAuthStore } from '../../store/authStore';
import { ArrowLeft, Sparkles, AlertTriangle, ShieldCheck, Ticket } from 'lucide-react';

interface ConfirmStepProps {
  slot: SlotData;
  onConfirm: (vehicleNo: string) => void;
  onBack: () => void;
  isSubmitting: boolean;
  error: Error | null;
}

export default function ConfirmStep({ slot, onConfirm, onBack, isSubmitting, error }: ConfirmStepProps) {
  const user = useAuthStore((state) => state.user);
  const [vehicleNo, setVehicleNo] = useState(user?.vehicleNo || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleNo.trim()) {
      alert('Please enter a valid vehicle registration number.');
      return;
    }
    onConfirm(vehicleNo.trim().toUpperCase());
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="group flex items-center text-xs font-black uppercase tracking-widest text-accent hover:text-[#3B82F6] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Slot Grid</span>
        </button>
        <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary font-mono bg-bg-base/60 border border-glass-border px-2 py-0.5 rounded-md shadow-inner">
          Step 3 of 4
        </span>
      </div>

      <div className="text-center max-w-lg mx-auto space-y-2">
        <div className="inline-flex items-center space-x-2 bg-accent/10 border border-accent/30 px-3 py-1.5 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-widest text-accent font-mono">
            Transaction Lock
          </span>
        </div>
        <h2 className="text-3xl font-black text-text-primary font-display uppercase tracking-tight">
          Confirm Reservation
        </h2>
        <p className="text-xs text-text-secondary leading-relaxed">
          Verify your spatial slot choice and enter your vehicle registration plate.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-md mx-auto w-full">
        {/* Ticket Preview Card */}
        <div className="relative overflow-hidden p-6 rounded-3xl border border-glass-border bg-bg-base/60 shadow-2xl">
          {/* Neon side border */}
          <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-accent" />

          <h3 className="flex items-center text-[10px] font-black uppercase tracking-widest text-accent mb-4">
            <Ticket className="w-4 h-4 mr-1.5" />
            Live Reservation Ticket
          </h3>
          
          <div className="space-y-3.5">
            <div className="flex justify-between items-center py-1.5 border-b border-glass-border/30">
              <span className="text-[10px] font-bold text-text-secondary uppercase">Campus Zone:</span>
              <span className="text-xs font-black text-text-primary uppercase tracking-wide">{slot.zone.name}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-glass-border/30">
              <span className="text-[10px] font-bold text-text-secondary uppercase">Parking Space:</span>
              <span className="text-sm font-black text-accent font-mono bg-accent/10 px-2 py-0.5 rounded border border-accent/20 tracking-wider">
                {slot.slotCode}
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-glass-border/30">
              <span className="text-[10px] font-bold text-text-secondary uppercase">Hold Duration:</span>
              <span className="text-xs font-black text-[#00E676] uppercase tracking-wide">15 MINS HOLD ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Vehicle Registration Input */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-black uppercase tracking-widest text-text-secondary">
            Vehicle Plate Number (e.g. UP32AB1234)
          </label>
          <input
            type="text"
            required
            placeholder="Enter vehicle plate number"
            value={vehicleNo}
            onChange={(e) => setVehicleNo(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-glass-border bg-bg-surface text-text-primary text-sm font-mono font-black uppercase tracking-widest focus:outline-none focus:border-accent hover:border-glass-border-hover focus:ring-1 focus:ring-accent-glow transition-all"
          />
        </div>

        {error && (
          <div className="flex items-start space-x-2 p-3 rounded-2xl bg-occupied/10 border border-occupied/20 text-xs font-bold text-occupied">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error.message}</span>
          </div>
        )}

        {/* Booking Guidelines */}
        <div className="flex items-start space-x-2 p-4 rounded-2xl bg-reserved/5 border border-reserved/20 text-[10px] text-text-secondary leading-relaxed">
          <AlertTriangle className="w-4 h-4 text-reserved flex-shrink-0 mt-0.5 animate-pulse" />
          <span>
            <strong>Rules & Guidelines:</strong> Faculty blocked slots are reserved exclusively for professors and staff. Booking a slot locks it for exactly 15 minutes. If your car does not arrive at the gate inside the 15-minute window, it will automatically expire and be released back to the general pool.
          </span>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center space-x-2 w-full py-4 rounded-2xl bg-accent text-[#F0F2FF] hover:bg-opacity-90 font-black text-xs uppercase tracking-widest shadow-[0_4px_20px_rgba(79,142,247,0.25)] hover:shadow-[0_0_20px_var(--accent-glow)] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 active:scale-[0.98]"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{isSubmitting ? 'Securing reservation hold...' : 'Agree & Book Slot Hold'}</span>
        </button>
      </form>
    </div>
  );
}
