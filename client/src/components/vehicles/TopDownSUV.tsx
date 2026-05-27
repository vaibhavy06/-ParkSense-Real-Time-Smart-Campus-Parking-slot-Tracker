import React from 'react';

interface TopDownSUVProps {
  color: string;
  className?: string;
}

export default function TopDownSUV({ color, className = '' }: TopDownSUVProps) {
  return (
    <svg
      width="24"
      height="34"
      viewBox="0 0 24 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 4 Tyres */}
      <rect x="0.5" y="3" width="2.5" height="6.5" rx="0.5" fill="#1C1F26" />
      <rect x="21" y="3" width="2.5" height="6.5" rx="0.5" fill="#1C1F26" />
      <rect x="0.5" y="24" width="2.5" height="6.5" rx="0.5" fill="#1C1F26" />
      <rect x="21" y="24" width="2.5" height="6.5" rx="0.5" fill="#1C1F26" />

      {/* Bulky SUV Body */}
      <rect x="3" y="1" width="18" height="32" rx="4.5" fill={color} stroke="#0B0D13" strokeWidth="1.2" />

      {/* Front Windshield Grill Outline */}
      <path d="M5 8.5 C 5 6.5, 19 6.5, 19 8.5" stroke="#0B0D13" strokeWidth="1.2" />

      {/* Cabin Roof / Large Windshield Glass */}
      <path
        d="M5 9.5 L19 9.5 C 19 21, 19 21, 19 22.5 C 19 24.5, 17 25.5, 12 25.5 C 7 25.5, 5 24.5, 5 22.5 Z"
        fill="#1E293B"
        fillOpacity="0.8"
        stroke="#0B0D13"
        strokeWidth="1.2"
      />

      {/* Windshield glare line */}
      <path d="M6 11.5 L11 18.5" stroke="#E2E8F0" strokeWidth="1" strokeLinecap="round" opacity="0.3" />

      {/* Roof grid lines */}
      <line x1="8" y1="12" x2="8" y2="21" stroke="#0B0D13" strokeWidth="1" />
      <line x1="16" y1="12" x2="16" y2="21" stroke="#0B0D13" strokeWidth="1" />

      {/* Headlights (Glowing Yellow Indicators) */}
      <circle cx="5.5" cy="2" r="1.2" fill="#FDE047" />
      <circle cx="18.5" cy="2" r="1.2" fill="#FDE047" />

      {/* Tail Lights */}
      <rect x="4.5" y="32.5" width="3.5" height="1" fill="#EF4444" />
      <rect x="16" y="32.5" width="3.5" height="1" fill="#EF4444" />
    </svg>
  );
}
