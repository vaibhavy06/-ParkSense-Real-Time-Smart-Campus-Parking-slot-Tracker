'use client';

import React, { useState } from 'react';

export default function PeakHeatmap() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Show key selective hours to fit screen cleanly
  const hours = [
    8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
  ];

  // Hover state
  const [hoveredCell, setHoveredCell] = useState<{
    day: string;
    hour: number;
    value: number;
  } | null>(null);

  // Generate a realistic, deterministic occupancy factor based on day and hour
  const getCellOccupancy = (dayIndex: number, hour: number) => {
    // Weekends (dayIndex 5 and 6) have very low usage
    if (dayIndex >= 5) {
      return 10 + Math.floor((hour % 4) * 8);
    }

    // Midweek (Tue/Wed/Thu) are highest, Mon/Fri slightly lower
    const dayFactor = dayIndex === 0 || dayIndex === 4 ? 0.85 : 1.0;
    
    // Core class hours: 9am-12pm and 2pm-4pm are highest
    let base = 25;
    if (hour >= 9 && hour <= 11) base = 85;
    else if (hour === 12 || hour === 13) base = 60; // lunch break dip
    else if (hour >= 14 && hour <= 16) base = 75;
    else if (hour === 8) base = 70; // arrival hour
    else if (hour === 17) base = 40; // departure hour
    else if (hour >= 18) base = 15;

    // Add slight deterministic variance
    const variance = ((dayIndex * hour) % 7) - 3;
    return Math.min(100, Math.max(0, Math.round(base * dayFactor + variance)));
  };

  const getDensityColor = (val: number) => {
    if (val < 20) return 'bg-blue-50 dark:bg-slate-900 text-slate-400';
    if (val >= 20 && val < 45) return 'bg-blue-100 dark:bg-blue-950/20 text-blue-700';
    if (val >= 45 && val < 65) return 'bg-blue-300 dark:bg-blue-900/40 text-blue-900';
    if (val >= 65 && val < 85) return 'bg-blue-500 text-white';
    return 'bg-blue-700 text-white font-bold ring-2 ring-blue-400 dark:ring-blue-600'; // Peak
  };

  return (
    <div className="w-full p-5 rounded-3xl bg-card border border-border-custom shadow-sm dark:bg-bg-dark-card dark:border-border transition-all">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary dark:text-gray-400">
            Weekly Peak Hour Traffic Heatmap
          </h3>
          <p className="text-[10px] text-text-secondary dark:text-gray-500 mt-0.5">
            Color intensity maps to average occupancy density.
          </p>
        </div>
        
        {/* Heatmap Legend */}
        <div className="flex items-center space-x-1.5 text-[9px] font-bold text-text-secondary dark:text-gray-400 uppercase">
          <span>Low</span>
          <span className="w-2.5 h-2.5 rounded bg-blue-50 border border-gray-200 dark:bg-slate-900 dark:border-slate-800" />
          <span className="w-2.5 h-2.5 rounded bg-blue-100" />
          <span className="w-2.5 h-2.5 rounded bg-blue-300" />
          <span className="w-2.5 h-2.5 rounded bg-blue-500" />
          <span className="w-2.5 h-2.5 rounded bg-blue-700" />
          <span>High</span>
        </div>
      </div>

      <div className="relative overflow-x-auto pb-2">
        <div className="min-w-[450px]">
          {/* Hours X-Header */}
          <div className="flex pl-10 mb-2">
            {hours.map((hr) => (
              <div key={hr} className="flex-1 text-center font-mono text-[9px] font-bold text-text-secondary dark:text-gray-500">
                {String(hr).padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {/* Days Grid Rows */}
          <div className="space-y-1.5">
            {days.map((day, dIdx) => (
              <div key={day} className="flex items-center">
                {/* Day Y-Header */}
                <div className="w-10 text-xs font-bold text-text-secondary dark:text-gray-400">
                  {day}
                </div>

                {/* Hour cells */}
                <div className="flex-1 flex gap-1.5">
                  {hours.map((hr) => {
                    const val = getCellOccupancy(dIdx, hr);
                    const colorClass = getDensityColor(val);

                    return (
                      <div
                        key={hr}
                        onMouseEnter={() => setHoveredCell({ day, hour: hr, value: val })}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`flex-1 aspect-square rounded-lg flex items-center justify-center text-[9px] font-mono transition-all duration-200 cursor-help hover:scale-105 hover:shadow-md ${colorClass}`}
                      >
                        {val}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating tooltip */}
      {hoveredCell && (
        <div className="mt-4 p-3 rounded-2xl bg-slate-900 text-white text-xs shadow-lg max-w-xs font-semibold dark:bg-black border border-gray-800 transition-all">
          📊 <span className="font-bold text-blue-400">{hoveredCell.day}s at {String(hoveredCell.hour).padStart(2, '0')}:00</span> · Avg Occupancy: <span className="font-mono font-bold text-yellow-400">{hoveredCell.value}%</span>
        </div>
      )}
    </div>
  );
}
