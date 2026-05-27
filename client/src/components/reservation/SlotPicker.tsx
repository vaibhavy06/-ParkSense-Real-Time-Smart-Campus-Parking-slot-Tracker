'use client';

import React, { useState } from 'react';
import { ZoneData, SlotData } from '../../store/slotStore';
import { ArrowLeft, Sparkles, Navigation } from 'lucide-react';

interface SlotPickerProps {
  zone: ZoneData;
  slots: SlotData[];
  onSelect: (slot: SlotData) => void;
  onBack: () => void;
}

export default function SlotPicker({ zone, slots, onSelect, onBack }: SlotPickerProps) {
  const [selectedSlot, setSelectedSlot] = useState<SlotData | null>(null);

  // Filter slots belonging only to this zone
  const zoneSlots = slots.filter((s) => s.zoneId === zone.id);

  const handleSlotClick = (slot: SlotData) => {
    if (slot.status === 'AVAILABLE' && !slot.isDisabled) {
      setSelectedSlot(slot);
    }
  };

  const handleProceed = () => {
    if (selectedSlot) {
      onSelect(selectedSlot);
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="group flex items-center text-xs font-black uppercase tracking-widest text-accent hover:text-[#3B82F6] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Zones</span>
        </button>
        <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary font-mono bg-bg-base/60 border border-glass-border px-2 py-0.5 rounded-md shadow-inner">
          Step 2 of 4
        </span>
      </div>

      <div className="text-center max-w-lg mx-auto space-y-2">
        <div className="inline-flex items-center space-x-2 bg-accent/10 border border-accent/30 px-3 py-1.5 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-widest text-accent font-mono">
            Spatial Telemetry Picker
          </span>
        </div>
        <h2 className="text-3xl font-black text-text-primary font-display uppercase tracking-tight">
          Select Slot in {zone.name.split(' - ')[0]}
        </h2>
        <p className="text-xs text-text-secondary leading-relaxed">
          Select a green slot from the interactive spatial matrix to secure your reservation.
        </p>
      </div>

      {/* Mini SVG Grid Layout (High fidelity cyber deck) */}
      <div className="flex justify-center p-6 rounded-3xl border border-glass-border bg-bg-base/40 shadow-inner">
        <svg
          viewBox="30 30 550 170"
          className="w-full max-w-2xl select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Grid lines pattern for a tech look */}
          <defs>
            <pattern id="pickerGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.01)" strokeWidth="0.5" />
            </pattern>
            <filter id="neonSpotGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect x="35" y="35" width="540" height="135" rx="12" fill="url(#pickerGrid)" stroke="var(--glass-border)" strokeWidth="1.5" strokeDasharray="8,6" />

          {zoneSlots.map((slot, index) => {
            // Relocalize slot x, y coordinates to fit neatly inside the mini-SVG window
            const isRow2 = index >= Math.ceil(zoneSlots.length / 2);
            const colIndex = isRow2 ? index - Math.ceil(zoneSlots.length / 2) : index;
            
            const localX = 60 + colIndex * 33;
            const localY = isRow2 ? 115 : 60;
            const width = 25;
            const height = 40;
            
            const isChosen = selectedSlot?.id === slot.id;
            const isAvailable = slot.status === 'AVAILABLE' && !slot.isDisabled;

            // Use exact design HSL variables
            let fillClass = 'fill-occupied/10 stroke-occupied/40';
            if (slot.status === 'AVAILABLE') fillClass = 'fill-available/10 stroke-available/30 hover:fill-available/20 hover:stroke-available';
            if (slot.status === 'RESERVED') fillClass = 'fill-reserved/10 stroke-reserved/40';
            if (slot.isDisabled) fillClass = 'fill-disabled/5 stroke-disabled/30';

            if (isChosen) {
              fillClass = 'fill-accent/20 stroke-accent filter-[url(#neonSpotGlow)]';
            }

            return (
              <g
                key={slot.id}
                onClick={() => handleSlotClick(slot)}
                className={`transition-all duration-300 ${
                  isAvailable ? 'cursor-pointer hover:scale-[1.06] origin-center' : 'cursor-not-allowed opacity-35'
                }`}
                style={{ transformOrigin: `${localX + width / 2}px ${localY + height / 2}px` }}
              >
                {/* Slot Block */}
                <rect
                  x={localX}
                  y={localY}
                  width={width}
                  height={height}
                  rx="6"
                  ry="6"
                  strokeWidth={isChosen ? 2.2 : 1.2}
                  strokeDasharray={isAvailable && !isChosen ? '3,2' : 'none'}
                  className={`transition-all duration-300 ${fillClass}`}
                />
                
                {/* Slot Code inside */}
                <text
                  x={localX + width / 2}
                  y={localY + height / 2 + 3.5}
                  fill={isChosen ? 'var(--accent)' : isAvailable ? 'var(--available)' : '#7B82A0'}
                  fontSize="7.5px"
                  fontFamily="var(--font-mono)"
                  fontWeight="900"
                  textAnchor="middle"
                  pointerEvents="none"
                >
                  {slot.slotCode.split('-')[1]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-4 border-t border-glass-border">
        <div className="text-xs font-bold text-text-secondary uppercase tracking-wider">
          Selected Slot: {selectedSlot ? (
            <span className="font-mono font-black text-accent ml-1.5 px-3 py-1 rounded-lg border border-accent/20 bg-accent/10 shadow-[0_0_12px_rgba(79,142,247,0.15)] text-[#F0F2FF]">
              Slot {selectedSlot.slotCode}
            </span>
          ) : (
            <span className="text-text-muted italic ml-1">None chosen</span>
          )}
        </div>
        
        <button
          onClick={handleProceed}
          disabled={!selectedSlot}
          className="flex items-center justify-center space-x-2 py-3 px-6 rounded-2xl bg-accent text-[#F0F2FF] hover:bg-opacity-90 font-black text-xs uppercase tracking-widest hover:shadow-[0_0_20px_var(--accent-glow)] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 active:scale-[0.98]"
        >
          <Navigation className="w-4 h-4" />
          <span>Confirm Selection</span>
        </button>
      </div>
    </div>
  );
}
