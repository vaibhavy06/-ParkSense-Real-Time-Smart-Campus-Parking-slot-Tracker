import React from 'react';

interface TopDownSedanProps {
  color: string; // Dynamic paint finish
  className?: string;
}

export default function TopDownSedan({ color, className = '' }: TopDownSedanProps) {
  return (
    <svg
      width="22"
      height="38"
      viewBox="0 0 22 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 4 Tyres */}
      <rect x="0.5" y="4" width="2" height="6.5" rx="0.5" fill="#1C1F26" />
      <rect x="19.5" y="4" width="2" height="6.5" rx="0.5" fill="#1C1F26" />
      <rect x="0.5" y="27" width="2" height="6.5" rx="0.5" fill="#1C1F26" />
      <rect x="19.5" y="27" width="2" height="6.5" rx="0.5" fill="#1C1F26" />

      {/* Main Sedan Body Chassis */}
      <rect x="2.5" y="1" width="17" height="36" rx="4" fill={color} stroke="#0B0D13" strokeWidth="1.2" />

      {/* Front Windshield Hood Line */}
      <path d="M4.5 10.5 C 4.5 8, 17.5 8, 17.5 10.5" stroke="#0B0D13" strokeWidth="1.2" />

      {/* Cabin Roof / Windshield Glass */}
      <path
        d="M5 11 L17 11 C 17 21, 17 21, 17 22 C 17 24, 15 25, 11 25 C 7 25, 5 24, 5 22 Z"
        fill="#1E293B"
        fillOpacity="0.8"
        stroke="#0B0D13"
        strokeWidth="1"
      />
      {/* Windshield glare line */}
      <path d="M6 13 L11 19" stroke="#E2E8F0" strokeWidth="1" strokeLinecap="round" opacity="0.3" />

      {/* Headlights (Glowing Yellow Indicators) */}
      <circle cx="5" cy="2" r="1.2" fill="#FDE047" />
      <circle cx="17" cy="2" r="1.2" fill="#FDE047" />

      {/* Tail Lights (Red Indicators) */}
      <rect x="4.5" y="36.5" width="3" height="1" fill="#EF4444" />
      <rect x="14.5" y="36.5" width="3" height="1" fill="#EF4444" />
    </svg>
  );
}
