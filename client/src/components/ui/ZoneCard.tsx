'use client';

import React from 'react';
import GlassCard from './GlassCard';

interface ZoneCardProps {
  name: string;
  subtext: string;
  totalSlots: number;
  available: number;
  occupied: number;
  reserved: number;
  allowedRoles: string[];
  isSelected: boolean;
  onClick: () => void;
  className?: string;
}

export default function ZoneCard({
  name,
  subtext,
  totalSlots,
  available,
  occupied,
  reserved,
  allowedRoles,
  isSelected,
  onClick,
  className = '',
}: ZoneCardProps) {
  // Segment calculations for visual segmented occupancy bar
  const pctAvail = Math.round((available / (totalSlots || 1)) * 100);
  const pctOcc = Math.round((occupied / (totalSlots || 1)) * 100);
  const pctRes = Math.round((reserved / (totalSlots || 1)) * 100);

  return (
    <GlassCard
      onClick={onClick}
      hoverable
      className={`cursor-pointer transition-all duration-300 ${
        isSelected
          ? 'border-accent shadow-[0_0_20px_-3px_var(--accent)] scale-[1.01]'
          : 'opacity-50 hover:opacity-80'
      } ${className}`}
    >
      {/* Zone Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-black text-sm text-text-primary font-display tracking-tight">
            {name}
          </h3>
          <p className="text-[10px] text-text-secondary font-semibold">
            {subtext}
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-black text-available font-mono">
            {available} FREE
          </span>
          <span className="text-[9px] text-text-muted block font-mono">
            of {totalSlots} slots
          </span>
        </div>
      </div>

      {/* Segmented Horizontal Progress Bar */}
      <div className="w-full space-y-1.5 my-3">
        <div className="w-full h-2 rounded-full bg-slate-800 dark:bg-slate-900 overflow-hidden flex">
          <div style={{ width: `${pctAvail}%` }} className="h-full bg-available transition-all duration-500" />
          <div style={{ width: `${pctRes}%` }} className="h-full bg-reserved transition-all duration-500" />
          <div style={{ width: `${pctOcc}%` }} className="h-full bg-occupied transition-all duration-500" />
        </div>
        
        {/* Progress legend labels */}
        <div className="flex items-center justify-between text-[8px] font-bold text-text-secondary font-mono">
          <span className="text-available">{available} Free</span>
          <span className="text-reserved">{reserved} Locked</span>
          <span className="text-occupied">{occupied} Parked</span>
        </div>
      </div>

      {/* Footer / Allowed Roles Badge list */}
      <div className="mt-4 flex flex-wrap gap-1 border-t border-glass-border pt-3">
        {allowedRoles.map((role) => (
          <span
            key={role}
            className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-slate-800 text-text-secondary border border-glass-border"
          >
            {role.substring(0, 4)}
          </span>
        ))}
      </div>
    </GlassCard>
  );
}
