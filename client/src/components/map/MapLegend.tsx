import React from 'react';

export default function MapLegend() {
  const items = [
    { color: 'bg-available border-available shadow-[0_0_8px_var(--available-glow)]', label: 'Available' },
    { color: 'bg-occupied border-[#FF4B4B] shadow-[0_0_8px_var(--occupied-glow)]', label: 'Occupied' },
    { color: 'bg-reserved border-[#FFB300] shadow-[0_0_8px_var(--reserved-glow)]', label: 'Reserved (15m)' },
    { color: 'bg-disabled/40 border-[#3A3F52] shadow-none', label: 'Disabled / Service' },
  ];

  return (
    <div className="p-5 rounded-3xl border border-glass-border bg-bg-surface/60 backdrop-blur-md shadow-2xl transition-all">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-4">
        Map Telemetry Legend
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.label} className="flex items-center space-x-3 bg-bg-base/30 px-3 py-2.5 rounded-xl border border-glass-border/40">
            <span className={`w-3 h-3 rounded-full border ${item.color} flex-shrink-0`} />
            <span className="text-xs font-bold text-text-primary">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
