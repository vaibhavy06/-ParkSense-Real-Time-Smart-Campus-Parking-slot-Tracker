import React from 'react';

interface ZoneContainerProps {
  id: string;
  name: string;
  className?: string;
}

export default function ZoneContainer({ id, name, className = '' }: ZoneContainerProps) {
  // Hardcoded layout coordinates mapped to coordinates generated in our seed script
  const zoneLayouts = {
    // Zone A - Main Gate (A-01 to A-30)
    'Zone A - Main Gate': {
      x: 60,
      y: 50,
      width: 535,
      height: 135,
      labelX: 70,
      labelY: 45,
      badgeColor: 'border-blue-300 text-blue-800 bg-blue-50 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/40',
    },
    // Zone B - Academic Block (B-01 to B-25)
    'Zone B - Academic Block': {
      x: 60,
      y: 190,
      width: 470,
      height: 115,
      labelX: 70,
      labelY: 185,
      badgeColor: 'border-emerald-300 text-emerald-800 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40',
    },
    // Zone C - Hostel & Canteen (C-01 to C-20)
    'Zone C - Hostel & Canteen': {
      x: 60,
      y: 310,
      width: 370,
      height: 115,
      labelX: 70,
      labelY: 305,
      badgeColor: 'border-indigo-300 text-indigo-800 bg-indigo-50 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/40',
    },
    // Zone D - Faculty Block (F-01 to F-15)
    'Zone D - Faculty Block': {
      x: 60,
      y: 430,
      width: 305,
      height: 115,
      labelX: 70,
      labelY: 425,
      badgeColor: 'border-purple-300 text-purple-800 bg-purple-50 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/40',
    },
  };

  // Fallback if zone name is slightly different
  const defaultLayout = {
    x: 60,
    y: 50,
    width: 500,
    height: 120,
    labelX: 70,
    labelY: 45,
    badgeColor: 'border-gray-300 text-gray-800 bg-gray-50',
  };

  // Find layout by looking up substrings
  const matchedKey = Object.keys(zoneLayouts).find(k => name.toLowerCase().includes(k.split(' - ')[0].toLowerCase().trim())) as keyof typeof zoneLayouts;
  
  const layout = matchedKey ? zoneLayouts[matchedKey] : defaultLayout;

  return (
    <g className={`transition-all duration-300 ${className}`}>
      {/* Dashed Zone Boundary */}
      <rect
        x={layout.x}
        y={layout.y}
        width={layout.width}
        height={layout.height}
        rx="8"
        ry="8"
        fill="none"
        stroke="#D1D5DB"
        strokeWidth="1.5"
        strokeDasharray="6,4"
        className="dark:stroke-gray-700 transition-colors"
      />

      {/* SVG-based HTML Label Overlay */}
      <foreignObject
        x={layout.labelX}
        y={layout.labelY - 14}
        width="220"
        height="28"
      >
        <div className="flex items-center">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase border shadow-sm ${layout.badgeColor}`}>
            {name}
          </span>
        </div>
      </foreignObject>
    </g>
  );
}
