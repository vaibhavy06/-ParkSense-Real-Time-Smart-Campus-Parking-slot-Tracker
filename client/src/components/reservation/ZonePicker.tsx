'use client';

import React from 'react';
import { ZoneData } from '../../store/slotStore';
import { useAuthStore } from '../../store/authStore';
import { Shield, Sparkles, AlertTriangle } from 'lucide-react';

interface ZonePickerProps {
  zones: ZoneData[];
  onSelect: (zone: ZoneData) => void;
}

export default function ZonePicker({ zones, onSelect }: ZonePickerProps) {
  const user = useAuthStore((state) => state.user);

  // Helper to resolve zone specific colors and text styles
  const getZoneStyles = (name: string) => {
    const lname = name.toLowerCase();
    if (lname.includes('zone a')) {
      return { stroke: '#4F8EF7', text: 'text-[#4F8EF7]', glow: 'shadow-[0_0_15px_rgba(79,142,247,0.15)]' };
    }
    if (lname.includes('zone b')) {
      return { stroke: '#A78BFA', text: 'text-purple-400', glow: 'shadow-[0_0_15px_rgba(167,139,250,0.15)]' };
    }
    if (lname.includes('zone c')) {
      return { stroke: '#2DD4BF', text: 'text-teal-400', glow: 'shadow-[0_0_15px_rgba(45,212,191,0.15)]' };
    }
    return { stroke: '#FFB300', text: 'text-[#FFB300]', glow: 'shadow-[0_0_15px_rgba(255,179,0,0.15)]' };
  };

  return (
    <div className="flex flex-col space-y-8">
      <div className="text-center max-w-lg mx-auto space-y-2">
        <div className="inline-flex items-center space-x-2 bg-accent/10 border border-accent/30 px-3 py-1.5 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-widest text-accent font-mono">
            Spatial Navigation Core
          </span>
        </div>
        <h2 className="text-3xl font-black text-text-primary font-display uppercase tracking-tight">
          Select Parking Zone
        </h2>
        <p className="text-xs text-text-secondary leading-relaxed">
          Choose a parking block to query real-time vacancy and secure your reservation hold.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {zones.map((zone) => {
          const occupancyRate = Math.round(
            ((zone.occupied + zone.reserved) / (zone.totalSlots || 1)) * 100
          );
          
          // Apply strict role restrictions
          const isAllowed = user && zone.allowedRoles.includes(user.role);
          const isFull = zone.available === 0;

          // Radial circle parameters for circular ring gauges
          const radius = 38;
          const strokeWidth = 6.5;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = circumference - (occupancyRate / 100) * circumference;

          const styles = getZoneStyles(zone.name);

          return (
            <div
              key={zone.id}
              onClick={() => isAllowed && !isFull && onSelect(zone)}
              className={`relative overflow-hidden p-6 rounded-3xl border bg-bg-surface/50 backdrop-blur-md transition-all duration-300 ${
                isAllowed && !isFull
                  ? 'cursor-pointer border-glass-border hover:bg-bg-surface/85 hover:border-glass-border-hover hover:scale-[1.01] hover:shadow-[0_20px_45px_rgba(0,0,0,0.4)]'
                  : 'opacity-35 cursor-not-allowed border-glass-border/30'
              } ${isAllowed && !isFull ? styles.glow : ''}`}
            >
              {/* Outer Glow Top Trim */}
              {isAllowed && !isFull && (
                <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-40" />
              )}

              <div className="flex items-center justify-between gap-4">
                
                {/* Text Description */}
                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className={`font-black text-lg transition-colors ${styles.text}`}>
                      {zone.name.split(' - ')[0]}
                    </h3>
                    <p className="text-[10px] font-black tracking-widest uppercase text-text-secondary mt-0.5">
                      {zone.name.split(' - ')[1]}
                    </p>
                  </div>

                  {/* Allowed Roles */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {zone.allowedRoles.map((role) => (
                      <span
                        key={role}
                        className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-bg-base/80 text-text-secondary border border-glass-border"
                      >
                        {role}
                      </span>
                    ))}
                  </div>

                  {!isAllowed && (
                    <span className="inline-flex items-center text-[9px] text-occupied font-black uppercase tracking-widest pt-1">
                      <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Role Restricted
                    </span>
                  )}
                </div>

                {/* Circular SVG Ring Gauge */}
                <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    {/* Background grey ring */}
                    <circle
                      cx="48"
                      cy="48"
                      r={radius}
                      fill="none"
                      stroke="rgba(255,255,255,0.03)"
                      strokeWidth={strokeWidth}
                    />
                    {/* Active colorful gauge ring */}
                    <circle
                      cx="48"
                      cy="48"
                      r={radius}
                      fill="none"
                      stroke={isFull ? '#FF4B4B' : styles.stroke}
                      strokeWidth={strokeWidth}
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  {/* Gauge Centered Percent */}
                  <div className="absolute text-center">
                    <span className="text-sm font-black font-mono text-text-primary tracking-tight block">
                      {occupancyRate}%
                    </span>
                    <span className="text-[7px] font-extrabold uppercase text-text-muted tracking-widest block -mt-0.5">
                      Full
                    </span>
                  </div>
                </div>

              </div>

              {/* Total Spot Stats Bar */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-glass-border/30 text-xs">
                <span className="font-bold text-text-secondary uppercase text-[10px]">Vacancy Status</span>
                <span className={`font-mono font-black ${isFull ? 'text-occupied' : 'text-available'}`}>
                  {isFull ? 'FULL' : `${zone.available} FREE SPOTS`}
                </span>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
