'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ReservationData } from '../../store/reservationStore';
import { useAuthStore } from '../../store/authStore';
import CountdownTimer from '../ui/CountdownTimer';
import ParkingSuccessCar from '../vehicles/ParkingSuccessCar';
import { Sparkles, CalendarCheck, CornerDownRight, Printer } from 'lucide-react';

interface SuccessScreenProps {
  reservation: ReservationData;
}

export default function SuccessScreen({ reservation }: SuccessScreenProps) {
  const router = useRouter();
  const { user } = useAuthStore();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center space-y-6 max-w-md mx-auto py-2">
      {/* Drive-in Vector Car Card */}
      <div className="w-full no-print">
        <ParkingSuccessCar />
      </div>

      <div className="text-center space-y-2 no-print">
        <div className="inline-flex items-center space-x-2 bg-available/10 border border-available/30 px-3 py-1.5 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-available animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-widest text-available font-mono">
            Slot Hold Lock Secured
          </span>
        </div>
        <h2 className="text-2xl font-black text-text-primary font-display uppercase tracking-tight">
          Slot Reserved Successfully!
        </h2>
        <p className="text-xs text-text-secondary leading-relaxed">
          Your reservation is active. Please arrive at the gate before the timer expires.
        </p>
      </div>

      {/* Premium Ticket Card */}
      <div className="w-full border border-glass-border bg-bg-surface/85 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl print:border-black print:bg-white print:text-black">
        {/* Ticket Header */}
        <div className="bg-gradient-to-r from-accent to-blue-700 p-4 text-center print:from-black print:to-black">
          <span className="text-[9px] uppercase font-black text-[#F0F2FF] tracking-widest font-mono">
            PARKSENSE DIGITAL TICKET
          </span>
        </div>

        {/* Ticket Body */}
        <div className="p-6 flex flex-col items-center space-y-6 print:bg-white">
          {/* Big Slot Code Display */}
          <div className="text-center">
            <span className="text-[9px] font-black uppercase tracking-widest text-text-secondary print:text-gray-600">
              Assigned Space
            </span>
            <div className="text-5xl font-black tracking-tight text-accent font-mono mt-1 print:text-black">
              {reservation.slot.slotCode}
            </div>
            <span className="text-xs font-bold text-text-primary block mt-1 uppercase tracking-wide print:text-black">
              {reservation.slot.zone.name}
            </span>
          </div>

          {/* Countdown timer */}
          <div className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-reserved/5 border border-reserved/20 print:border-gray-300">
            <span className="text-[11px] font-bold text-reserved uppercase tracking-wider flex items-center print:text-black">
              <CalendarCheck className="w-4 h-4 mr-1.5" />
              Holds For:
            </span>
            <CountdownTimer
              expiresAt={reservation.expiresAt}
              onExpire={() => router.refresh()}
              className="text-reserved font-mono font-black text-sm tracking-widest print:text-black"
            />
          </div>

          {/* Premium Vector SVG QR Code */}
          <div className="flex flex-col items-center space-y-2">
            <div className="p-3.5 bg-[#F0F2FF] border border-glass-border rounded-2xl shadow-inner print:border-gray-400 print:bg-white">
              <svg
                width="130"
                height="130"
                viewBox="0 0 29 29"
                className="text-bg-base print:text-black"
                fill="currentColor"
              >
                {/* Visual Mock QR Matrix */}
                <rect x="0" y="0" width="7" height="7" />
                <rect x="1" y="1" width="5" height="5" fill="#FFFFFF" />
                <rect x="2" y="2" width="3" height="3" />
                
                <rect x="22" y="0" width="7" height="7" />
                <rect x="23" y="1" width="5" height="5" fill="#FFFFFF" />
                <rect x="24" y="2" width="3" height="3" />
                
                <rect x="0" y="22" width="7" height="7" />
                <rect x="1" y="22" width="5" height="5" fill="#FFFFFF" />
                <rect x="2" y="22" width="3" height="3" />
                
                <rect x="9" y="1" width="2" height="2" />
                <rect x="12" y="0" width="3" height="1" />
                <rect x="16" y="2" width="2" height="4" />
                <rect x="10" y="5" width="4" height="2" />
                
                <rect x="22" y="9" width="3" height="3" />
                <rect x="25" y="12" width="4" height="2" />
                <rect x="20" y="15" width="2" height="4" />
                <rect x="26" y="16" width="3" height="1" />

                <rect x="9" y="22" width="3" height="2" />
                <rect x="14" y="24" width="4" height="3" />
                <rect x="19" y="22" width="2" height="5" />
                
                <rect x="10" y="10" width="9" height="9" />
                <rect x="12" y="12" width="5" height="5" fill="#FFFFFF" />
                <rect x="14" y="14" width="1" height="1" />
              </svg>
            </div>
            <span className="text-[9px] font-mono font-black text-text-secondary uppercase tracking-widest print:text-gray-600">
              Scan barcode at guard gate
            </span>
          </div>
        </div>

        {/* Ticket Footer / Print view guidelines */}
        <div className="bg-bg-base/40 p-4 border-t border-glass-border text-center print:border-gray-300">
          <p className="text-[10px] text-text-secondary font-mono tracking-wider print:text-black">
            TICKET ID: {reservation.id.substring(0, 16).toUpperCase()} • HOLDER: {user?.name.toUpperCase()} • PLATE: {user?.vehicleNo || 'ANONYMOUS'}
          </p>
        </div>
      </div>

      {/* Interactive Action Buttons */}
      <div className="w-full flex flex-col sm:flex-row gap-3 no-print">
        <button
          onClick={handlePrint}
          className="flex items-center justify-center space-x-2 flex-grow py-4 rounded-2xl border border-glass-border bg-bg-card hover:bg-bg-card-hover text-text-secondary hover:text-text-primary font-black text-xs uppercase tracking-widest transition-all duration-300 active:scale-[0.98]"
        >
          <Printer className="w-4 h-4" />
          <span>Print Clearance Slip</span>
        </button>

        <button
          onClick={() => router.push('/map')}
          className="flex items-center justify-center space-x-2 flex-grow py-4 rounded-2xl bg-accent text-[#F0F2FF] hover:bg-opacity-90 font-black text-xs uppercase tracking-widest shadow-[0_4px_20px_rgba(79,142,247,0.25)] hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-300 active:scale-[0.98]"
        >
          <CornerDownRight className="w-4 h-4" />
          <span>View Live Map HUD</span>
        </button>
      </div>
    </div>
  );
}
