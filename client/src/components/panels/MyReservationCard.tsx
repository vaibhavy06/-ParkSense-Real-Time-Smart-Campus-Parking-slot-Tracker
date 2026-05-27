'use client';

import React from 'react';
import { useReservation } from '../../hooks/useReservation';
import CountdownTimer from '../ui/CountdownTimer';
import { AlertCircle, CalendarRange, Trash2 } from 'lucide-react';

export default function MyReservationCard() {
  const { activeReservation, cancelReservation, isCancelling } = useReservation();

  if (!activeReservation) return null;

  const handleCancel = async () => {
    if (confirm('Are you sure you want to cancel your slot reservation hold?')) {
      try {
        await cancelReservation(activeReservation.id);
      } catch (err: any) {
        alert(err.message || 'Failed to cancel reservation.');
      }
    }
  };

  return (
    <div className="relative overflow-hidden p-5 rounded-3xl border border-glass-border bg-bg-surface/85 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_20px_var(--reserved-dim)] transition-all">
      {/* Top golden border indicator */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#FFB300] to-transparent" />
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="flex items-center text-[10px] font-black uppercase tracking-widest text-reserved">
            <CalendarRange className="w-3.5 h-3.5 mr-1" />
            Active Reservation hold
          </span>
          <h3 className="text-3xl font-black text-text-primary font-mono mt-1.5 tracking-tight">
            Slot {activeReservation.slot.slotCode}
          </h3>
          <p className="text-xs text-text-secondary font-medium">
            {activeReservation.slot.zone.name}
          </p>
        </div>
        
        <div className="bg-bg-base/60 border border-glass-border p-2 px-3 rounded-2xl text-center shadow-inner">
          <span className="text-[9px] uppercase font-black text-reserved tracking-widest block mb-1">
            Expires In
          </span>
          <CountdownTimer
            expiresAt={activeReservation.expiresAt}
            className="text-reserved font-mono font-bold text-sm tracking-widest"
          />
        </div>
      </div>

      <hr className="border-glass-border my-4" />

      <div className="flex flex-col space-y-4">
        <div className="flex items-start space-x-2 text-[11px] text-text-secondary leading-relaxed bg-reserved/5 border border-reserved/20 p-3 rounded-xl">
          <AlertCircle className="w-4 h-4 text-reserved flex-shrink-0 mt-0.5" />
          <span>
            This reservation locks the slot for you. Please arrive at the college gate and park within the next 15 minutes, or the slot will auto-release.
          </span>
        </div>

        <button
          onClick={handleCancel}
          disabled={isCancelling}
          className="flex items-center justify-center space-x-2 w-full py-3 px-4 rounded-xl bg-occupied/10 border border-occupied/30 text-occupied hover:bg-occupied/20 font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          <Trash2 className="w-4 h-4" />
          <span>{isCancelling ? 'Cancelling hold...' : 'Cancel reservation'}</span>
        </button>
      </div>
    </div>
  );
}
