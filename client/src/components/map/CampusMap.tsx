'use client';

import React, { useState, useEffect, useRef } from 'react';
import ParkingSlot from './ParkingSlot';
import ZoneBoundary from './ZoneBoundary';
import SlotTooltip from './SlotTooltip';
import { SlotData, ZoneData } from '../../store/slotStore';
import { useAuthStore } from '../../store/authStore';

interface CampusMapProps {
  slots: SlotData[];
  zones: ZoneData[];
  selectedZone: string;
  selectedStatus: string;
  highlightedSlotId: string | null;
  setHighlightedSlotId: (id: string | null) => void;
  onReserve: (slot: SlotData) => void;
}

export default function CampusMap({
  slots,
  zones,
  selectedZone,
  selectedStatus,
  highlightedSlotId,
  setHighlightedSlotId,
  onReserve,
}: CampusMapProps) {
  const user = useAuthStore((state) => state.user);
  
  // Tooltip tracking states
  const [hoveredSlot, setHoveredSlot] = useState<SlotData | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const tooltipTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (e: React.MouseEvent<SVGElement>, slot: SlotData) => {
    if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
    
    // Fetch absolute cursor location
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    setHoveredSlot(slot);
    setTooltipPos({ x, y });
  };

  const handleMouseLeave = () => {
    tooltipTimeout.current = setTimeout(() => {
      setHoveredSlot(null);
      setTooltipPos(null);
    }, 150); // slight buffer so they can hover onto the tooltip
  };

  // Check if a slot is focused based on filters
  const getSlotOpacity = (slot: SlotData) => {
    // 1. Zone filter matching
    let matchesZone = true;
    if (selectedZone !== 'All') {
      const zoneName = slot.zone.name.toLowerCase();
      if (selectedZone === 'Zone D') {
        matchesZone = zoneName.includes('faculty');
      } else {
        matchesZone = zoneName.includes(selectedZone.toLowerCase());
      }
    }

    // 2. Status filter matching
    let matchesStatus = true;
    if (selectedStatus !== 'All') {
      matchesStatus = slot.status === selectedStatus;
    }

    return matchesZone && matchesStatus ? 1 : 0.2;
  };

  // Check if a zone container is focused based on current filter
  const getZoneOpacity = (zoneName: string) => {
    if (selectedZone === 'All') return 1;
    const normalizedZone = selectedZone === 'Zone D' ? 'faculty' : selectedZone.toLowerCase();
    return zoneName.toLowerCase().includes(normalizedZone) ? 1 : 0.35;
  };

  return (
    <div className="relative w-full aspect-[4/3] bg-bg-surface border border-glass-border rounded-3xl overflow-hidden shadow-2xl p-2 md:p-4">
      {/* SVG Canvas Map */}
      <svg
        viewBox="0 0 700 580"
        className="w-full h-full select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Cyberpunk Glow Filters */}
          <filter id="blueGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="purpleGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
            
          </filter>
          <filter id="tealGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="amberGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          {/* Grid lines pattern for a tech look */}
          <pattern id="techGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill="#080B12" />
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.015)" strokeWidth="1" />
          </pattern>
        </defs>

        {/* ================================================================= */}
        {/* BACKGROUND & LANDSCAPING                                          */}
        {/* ================================================================= */}
        
        {/* Tech Grid Base */}
        <rect width="700" height="580" rx="20" fill="url(#techGrid)" />

        {/* Outer Boundary glow border */}
        <rect x="15" y="15" width="670" height="550" rx="16" fill="none" stroke="rgba(79, 142, 247, 0.1)" strokeWidth="2" strokeDasharray="12,6" />

        {/* ================================================================= */}
        {/* ROADS & ENTRYWAYS (Sleek deep carbon grey asphalt)                 */}
        {/* ================================================================= */}
        
        {/* Main Entry Road from bottom left */}
        <path d="M 15 450 L 685 450" stroke="#121829" strokeWidth="36" strokeLinecap="round" fill="none" />
        {/* Main Center Road going vertical */}
        <path d="M 610 50 L 610 550" stroke="#121829" strokeWidth="36" strokeLinecap="round" fill="none" />
        
        {/* Road center neon cyan dash marks */}
        <path d="M 30 450 L 670 450" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="8,10" fill="none" opacity="0.4" />
        <path d="M 610 70 L 610 530" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="8,10" fill="none" opacity="0.4" />

        {/* College Gate Label */}
        <g transform="translate(30, 485)">
          <rect width="120" height="22" rx="6" fill="#0E1320" fillOpacity="0.9" stroke="var(--glass-border)" strokeWidth="1" />
          <text x="60" y="14" fill="var(--text-secondary)" fontSize="9px" fontFamily="var(--font-mono)" fontWeight="900" tracking-widest="0.05em" textAnchor="middle">
            ▲ MAIN CAMPUS GATE
          </text>
        </g>

        {/* Academic Block Landscaping label */}
        <g transform="translate(370, 25)">
          <rect width="180" height="26" rx="8" fill="rgba(79, 142, 247, 0.05)" stroke="rgba(79, 142, 247, 0.2)" strokeWidth="1" strokeDasharray="4,4" />
          <text x="90" y="16" fill="var(--accent)" fontSize="9px" fontFamily="var(--font-display)" fontWeight="900" tracking-widest="0.08em" textAnchor="middle">
            CSE & IT ACADEMIC BLOCK
          </text>
        </g>

        {/* ================================================================= */}
        {/* ZONES BOUNDARIES & LABELS                                         */}
        {/* ================================================================= */}
        {zones.map((zone) => (
          <g key={zone.id} style={{ opacity: getZoneOpacity(zone.name), transition: 'opacity 300ms ease' }}>
            <ZoneBoundary
              id={zone.id}
              name={zone.name}
              className="transition-all duration-300"
            />
          </g>
        ))}

        {/* ================================================================= */}
        {/* PARKING SLOTS                                                     */}
        {/* ================================================================= */}
        {slots.map((slot) => (
          <g
            key={slot.id}
            style={{
              opacity: getSlotOpacity(slot),
              transition: 'opacity 300ms ease',
            }}
          >
            <ParkingSlot
              slot={slot}
              isHighlighted={highlightedSlotId === slot.id}
              onClick={onReserve}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          </g>
        ))}
      </svg>

      {/* Floating Hover Tooltip */}
      <SlotTooltip
        slot={hoveredSlot}
        position={tooltipPos}
        onReserve={onReserve}
        onClose={() => {
          setHoveredSlot(null);
          setTooltipPos(null);
        }}
      />
    </div>
  );
}

