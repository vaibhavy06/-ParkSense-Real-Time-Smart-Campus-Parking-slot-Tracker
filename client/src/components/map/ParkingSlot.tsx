'use client';

import React from 'react';
import { SlotData } from '../../store/slotStore';
import TopDownCar from './TopDownCar';
import { Clock } from 'lucide-react';

interface ParkingSlotProps {
  slot: SlotData;
  isHighlighted: boolean;
  onClick: (slot: SlotData) => void;
  onMouseEnter: (e: React.MouseEvent<SVGElement>, slot: SlotData) => void;
  onMouseLeave: () => void;
}

export default function ParkingSlot({
  slot,
  isHighlighted,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: ParkingSlotProps) {
  
  const width = 25;
  const height = 40;
  const rx = 4;

  const handleClick = () => {
    if (slot.status === 'AVAILABLE' && !slot.isDisabled) {
      onClick(slot);
    }
  };

  const renderSlotContents = () => {
    if (slot.isDisabled) {
      // Cross mark for disabled spaces
      return (
        <path
          d={`M ${slot.x + 4} ${slot.y + 4} L ${slot.x + width - 4} ${slot.y + height - 4} M ${slot.x + width - 4} ${slot.y + 4} L ${slot.x + 4} ${slot.y + height - 4}`}
          stroke="var(--text-muted)"
          strokeWidth="1.5"
          pointerEvents="none"
          opacity="0.5"
        />
      );
    }

    if (slot.status === 'AVAILABLE') {
      // Empty slot with faint letter "P" centered
      return (
        <text
          x={slot.x + width / 2}
          y={slot.y + height / 2 + 3}
          fill="var(--available)"
          opacity="0.3"
          fontSize="11px"
          fontFamily="var(--font-display)"
          fontWeight="900"
          textAnchor="middle"
          pointerEvents="none"
        >
          P
        </text>
      );
    }

    if (slot.status === 'OCCUPIED') {
      // Render beautiful top-down vehicle SVG
      return (
        <g transform={`translate(${slot.x + 1.5}, ${slot.y + 1})`}>
          <TopDownCar slotCode={slot.slotCode} />
        </g>
      );
    }

    if (slot.status === 'RESERVED') {
      // Semi-transparent car + clock overlay
      return (
        <g>
          {/* Faint sedan outline */}
          <g transform={`translate(${slot.x + 1.5}, ${slot.y + 1})`} opacity="0.35">
            <TopDownCar slotCode={slot.slotCode} />
          </g>
          {/* Glowing central clock icon inside reserved space */}
          <circle
            cx={slot.x + width / 2}
            cy={slot.y + height / 2}
            r="8"
            fill="none"
            stroke="var(--reserved)"
            strokeWidth="1.5"
            className="animate-pulse-ring"
            pointerEvents="none"
          />
          <circle
            cx={slot.x + width / 2}
            cy={slot.y + height / 2}
            r="3"
            fill="#FFFFFF"
            pointerEvents="none"
          />
        </g>
      );
    }

    return null;
  };

  // Base slot rect classes
  const getSlotBorderClass = () => {
    if (slot.isDisabled) return 'stroke-disabled fill-disabled/10';
    if (isHighlighted) return 'stroke-accent fill-accent-glow/15';
    
    if (slot.status === 'AVAILABLE') {
      return 'stroke-available/30 fill-available/5 hover:fill-available/10 hover:stroke-available/60 dashed';
    }
    if (slot.status === 'OCCUPIED') {
      return 'stroke-occupied/35 fill-occupied/5';
    }
    if (slot.status === 'RESERVED') {
      return 'stroke-reserved/45 fill-reserved/5';
    }
    return '';
  };

  const isDashed = slot.status === 'AVAILABLE' && !slot.isDisabled;

  return (
    <g
      className={`cursor-pointer transition-all duration-300 ${
        slot.status === 'AVAILABLE' && !slot.isDisabled ? 'hover:scale-[1.04] origin-center' : ''
      } ${isHighlighted ? 'animate-nearest-bounce' : ''}`}
      onClick={handleClick}
      onMouseEnter={(e) => onMouseEnter(e, slot)}
      onMouseLeave={onMouseLeave}
      role="button"
      aria-label={`Parking slot ${slot.slotCode}, Status: ${slot.status}`}
      style={{ transformOrigin: `${slot.x + width / 2}px ${slot.y + height / 2}px` }}
    >
      {/* Base border rect block */}
      <rect
        x={slot.x}
        y={slot.y}
        width={width}
        height={height}
        rx={rx}
        ry={rx}
        strokeWidth={isHighlighted ? 2 : 1.2}
        strokeDasharray={isDashed ? '3,2' : 'none'}
        className={`transition-all duration-300 ${getSlotBorderClass()}`}
      />

      {/* Internal Graphics (Car, P indicator, Crossmark) */}
      {renderSlotContents()}
    </g>
  );
}
