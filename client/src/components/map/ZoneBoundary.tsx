import React from 'react';

interface ZoneBoundaryProps {
  id: string;
  name: string;
  className?: string;
}

export default function ZoneBoundary({ id, name, className = '' }: ZoneBoundaryProps) {
  // SVG coordinates matching the seed coordinates
  const zoneLayouts = {
    'Zone A - Main Gate': {
      x: 55,
      y: 45,
      width: 535,
      height: 135,
      labelX: 65,
      labelY: 40,
      glowFilter: 'url(#blueGlow)',
      badgeColor: 'border-blue-500/30 text-[#4F8EF7] bg-blue-950/20 shadow-[0_0_15px_rgba(79,142,247,0.15)]',
    },
    'Zone B - Academic Block': {
      x: 55,
      y: 185,
      width: 470,
      height: 115,
      labelX: 65,
      labelY: 180,
      glowFilter: 'url(#purpleGlow)',
      badgeColor: 'border-purple-500/30 text-purple-400 bg-purple-950/20 shadow-[0_0_15px_rgba(167,139,250,0.15)]',
    },
    'Zone C - Hostel & Canteen': {
      x: 55,
      y: 305,
      width: 370,
      height: 115,
      labelX: 65,
      labelY: 300,
      glowFilter: 'url(#tealGlow)',
      badgeColor: 'border-teal-500/30 text-teal-400 bg-teal-950/20 shadow-[0_0_15px_rgba(45,212,191,0.15)]',
    },
    'Zone D - Faculty Block': {
      x: 55,
      y: 425,
      width: 305,
      height: 115,
      labelX: 65,
      labelY: 420,
      glowFilter: 'url(#amberGlow)',
      badgeColor: 'border-amber-500/30 text-[#FFB300] bg-amber-950/20 shadow-[0_0_15px_rgba(255,179,0,0.15)]',
    },
  };

  const defaultLayout = {
    x: 55,
    y: 45,
    width: 500,
    height: 120,
    labelX: 65,
    labelY: 40,
    glowFilter: 'none',
    badgeColor: 'border-slate-800 text-slate-400 bg-slate-900/40',
  };

  // Match key from substring
  const matchedKey = Object.keys(zoneLayouts).find(k => 
    name.toLowerCase().includes(k.split(' - ')[0].toLowerCase().trim())
  ) as keyof typeof zoneLayouts;
  
  const layout = matchedKey ? zoneLayouts[matchedKey] : defaultLayout;

  return (
    <g className={`transition-all duration-300 ${className}`}>
      {/* Glowing boundary rect */}
      <rect
        x={layout.x}
        y={layout.y}
        width={layout.width}
        height={layout.height}
        rx="12"
        ry="12"
        fill="none"
        stroke="var(--glass-border)"
        strokeWidth="1.5"
        strokeDasharray="6,4"
        filter={layout.glowFilter}
        className="transition-colors duration-300"
      />

      {/* Floating glass pill badge */}
      <foreignObject
        x={layout.labelX}
        y={layout.labelY - 14}
        width="240"
        height="32"
      >
        <div className="flex items-center">
          <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border backdrop-blur-md transition-all ${layout.badgeColor}`}>
            {name}
          </span>
        </div>
      </foreignObject>
    </g>
  );
}
