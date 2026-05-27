'use client';

import React from 'react';
import { Navigation, Compass, Filter } from 'lucide-react';

interface MapControlsProps {
  selectedZone: string;
  setSelectedZone: (zone: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  onFindNearest: () => void;
}

export default function MapControls({
  selectedZone,
  setSelectedZone,
  selectedStatus,
  setSelectedStatus,
  onFindNearest,
}: MapControlsProps) {
  const zones = ['All', 'Zone A', 'Zone B', 'Zone C', 'Zone D'];
  const statuses = ['All', 'AVAILABLE', 'OCCUPIED', 'RESERVED'];

  const getStatusLabel = (status: string) => {
    if (status === 'All') return 'All Statuses';
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  const getZoneLabel = (zone: string) => {
    if (zone === 'All') return 'All Zones';
    if (zone === 'Zone D') return 'Faculty Zone';
    return zone;
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-3xl border border-glass-border bg-bg-surface/60 backdrop-blur-md shadow-2xl transition-all">
      <div className="flex flex-col gap-4 flex-grow">
        {/* Zone Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center text-xs font-bold text-text-secondary uppercase tracking-widest mr-2">
            <Compass className="w-3.5 h-3.5 mr-1 text-accent" />
            <span>Campus Zones</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {zones.map((zone) => {
              const isSelected = selectedZone === zone;
              return (
                <button
                  key={zone}
                  onClick={() => setSelectedZone(zone)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 border ${
                    isSelected
                      ? 'bg-accent/20 text-[#F0F2FF] border-accent shadow-[0_0_12px_rgba(79,142,247,0.25)]'
                      : 'bg-bg-base/30 text-text-secondary border-glass-border hover:bg-bg-base/60 hover:text-text-primary hover:border-glass-border-hover'
                  }`}
                >
                  {getZoneLabel(zone)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center text-xs font-bold text-text-secondary uppercase tracking-widest mr-2">
            <Filter className="w-3.5 h-3.5 mr-1 text-accent" />
            <span>Live Status</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {statuses.map((status) => {
              const isSelected = selectedStatus === status;
              
              // Custom neon border/bg styles for selected filters
              let activeStyle = 'bg-accent/20 text-[#F0F2FF] border-accent shadow-[0_0_12px_rgba(79,142,247,0.25)]';
              if (isSelected) {
                if (status === 'AVAILABLE') {
                  activeStyle = 'bg-available/10 text-available border-available shadow-[0_0_12px_var(--available-glow)]';
                } else if (status === 'OCCUPIED') {
                  activeStyle = 'bg-occupied/10 text-occupied border-occupied shadow-[0_0_12px_var(--occupied-glow)]';
                } else if (status === 'RESERVED') {
                  activeStyle = 'bg-reserved/10 text-reserved border-reserved shadow-[0_0_12px_var(--reserved-glow)]';
                }
              }

              return (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 border ${
                    isSelected
                      ? activeStyle
                      : 'bg-bg-base/30 text-text-secondary border-glass-border hover:bg-bg-base/60 hover:text-text-primary hover:border-glass-border-hover'
                  }`}
                >
                  {getStatusLabel(status)}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Find Nearest Button */}
      <button
        onClick={onFindNearest}
        className="relative group flex items-center justify-center space-x-2.5 px-6 py-4 rounded-2xl bg-accent text-[#F0F2FF] font-black text-xs tracking-widest uppercase overflow-hidden shadow-[0_4px_20px_rgba(79,142,247,0.25)] hover:shadow-[0_0_25px_var(--accent-glow)] transition-all duration-300 active:scale-[0.97]"
      >
        {/* Pulsing ring inside button */}
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-accent via-blue-400 to-accent opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-pulse" />
        
        <Navigation className="w-4.5 h-4.5 text-[#F0F2FF] group-hover:animate-bounce flex-shrink-0" />
        <span className="relative z-10">Nearest Available</span>
        <kbd className="relative z-10 hidden sm:inline-block px-2 py-0.5 rounded border border-[#F0F2FF]/40 text-[9px] font-mono opacity-80">
          F
        </kbd>
      </button>
    </div>
  );
}
