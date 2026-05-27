import React from 'react';

interface TopDownMotoProps {
  color: string;
  className?: string;
}

export default function TopDownMoto({ color, className = '' }: TopDownMotoProps) {
  return (
    <svg
      width="12"
      height="30"
      viewBox="0 0 12 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Front Wheel */}
      <rect x="5" y="1" width="2" height="5" rx="0.5" fill="#1C1F26" />
      
      {/* Rear Wheel */}
      <rect x="5" y="24" width="2" height="5" rx="0.5" fill="#1C1F26" />

      {/* Handlebars */}
      <path d="M1 5 L11 5" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />
      {/* Grips */}
      <rect x="0.5" y="4" width="1.5" height="2" rx="0.3" fill="#1C1F26" />
      <rect x="10" y="4" width="1.5" height="2" rx="0.3" fill="#1C1F26" />

      {/* Main Motorcycle Body Frame */}
      <rect x="3.5" y="5.5" width="5" height="18" rx="2" fill={color} stroke="#0B0D13" strokeWidth="0.8" />

      {/* Seat Cushion Area */}
      <rect x="4.5" y="11" width="3" height="9" rx="1" fill="#1E293B" />

      {/* Front Lamp ( Glowing Indicator ) */}
      <circle cx="6" cy="1" r="0.8" fill="#FDE047" />

      {/* Tail Lamp */}
      <circle cx="6" cy="23.5" r="0.8" fill="#EF4444" />
    </svg>
  );
}
