import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  className?: string;
}

export default function ProgressBar({ value, className = '' }: ProgressBarProps) {
  // Bound value
  const percentage = Math.min(100, Math.max(0, value));

  // Determine color matching occupancy density
  let barColor = 'bg-available'; // Green (< 60%)
  if (percentage >= 60 && percentage < 85) {
    barColor = 'bg-reserved'; // Amber (60% - 85%)
  } else if (percentage >= 85) {
    barColor = 'bg-occupied'; // Red (>= 85%)
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1 text-xs font-semibold text-text-secondary dark:text-gray-400">
        <span>Occupancy</span>
        <span className="font-mono">{percentage}%</span>
      </div>
      <div className="w-full h-2.5 bg-gray-100 rounded-full dark:bg-gray-800 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
