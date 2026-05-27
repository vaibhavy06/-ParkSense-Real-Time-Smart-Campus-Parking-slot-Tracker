'use client';

import React from 'react';

export default function ParkingSuccessCar() {
  return (
    <div className="relative w-full h-44 bg-slate-950/20 border border-glass-border rounded-3xl overflow-hidden flex items-center justify-center">
      {/* Visual Road Markings */}
      <div className="absolute inset-x-0 bottom-4 h-0.5 border-t border-dashed border-text-muted opacity-30" />
      <div className="absolute inset-y-0 left-12 w-0.5 border-l border-dashed border-text-muted opacity-30" />

      {/* Target Parking Slot */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-28 h-18 border-2 border-dashed border-available/40 rounded-2xl flex items-center justify-center bg-available-dim/20 shadow-[0_0_15px_-5px_var(--available)]">
        <span className="font-mono text-xs font-black text-available/40 tracking-wider">
          TARGET SLOT
        </span>
      </div>

      {/* Animated Driving Car inside target */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-28 h-18 flex items-center justify-center animate-car-drive-in">
        {/* Draw a gorgeous top-down Sedan at 90-deg angle to match landscape slot */}
        <svg
          width="82"
          height="48"
          viewBox="0 0 82 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
        >
          {/* 4 Tyres */}
          <rect x="10" y="0.5" width="14" height="4" rx="1" fill="#1C1F26" />
          <rect x="58" y="0.5" width="14" height="4" rx="1" fill="#1C1F26" />
          <rect x="10" y="43.5" width="14" height="4" rx="1" fill="#1C1F26" />
          <rect x="58" y="43.5" width="14" height="4" rx="1" fill="#1C1F26" />

          {/* Main Car Body Profile */}
          <rect x="2" y="3.5" width="78" height="41" rx="8" fill="#4F8EF7" stroke="#0B0D13" strokeWidth="1.5" />

          {/* Cockpit Window */}
          <rect x="22" y="7.5" width="42" height="33" rx="5" fill="#1E293B" stroke="#0B0D13" strokeWidth="1.2" />
          {/* Windscreens glares */}
          <path d="M26 12 L36 36" stroke="#E2E8F0" strokeWidth="1.5" strokeLinecap="round" opacity="0.25" />

          {/* Headlights (Glowing Yellow Indicators) */}
          <circle cx="80" cy="11.5" r="1.5" fill="#FDE047" />
          <circle cx="80" cy="36.5" r="1.5" fill="#FDE047" />

          {/* Tail Lights */}
          <rect x="0.5" y="10.5" width="1" height="6" fill="#EF4444" />
          <rect x="0.5" y="31.5" width="1" height="6" fill="#EF4444" />
        </svg>
      </div>

      {/* Floating Glowing Checkmark overlay */}
      <div className="absolute top-2 right-4 w-7 h-7 rounded-full bg-available text-white flex items-center justify-center text-xs font-black shadow-lg shadow-green-500/35">
        ✓
      </div>
    </div>
  );
}
