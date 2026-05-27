import React from 'react';
import GlassCard from './GlassCard';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: string | number;
    isPositive: boolean;
  };
  subtext?: string;
  glowColor?: 'available' | 'occupied' | 'reserved' | 'accent';
  className?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  trend,
  subtext,
  glowColor = 'accent',
  className = '',
}: StatCardProps) {
  return (
    <GlassCard
      hoverable
      glowColor={glowColor}
      className={`relative overflow-hidden flex flex-col justify-between min-h-[140px] ${className}`}
    >
      {/* Large Back-Illuminated Background Icon (10% Opacity) */}
      {icon && (
        <div className="absolute -right-4 -bottom-6 text-text-muted opacity-[0.06] w-28 h-28 pointer-events-none transform rotate-12 scale-125 transition-transform duration-500 hover:rotate-6">
          {icon}
        </div>
      )}

      {/* Header Info */}
      <div className="flex items-center justify-between mb-3 z-10">
        <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
          {title}
        </span>
        {icon && <div className="text-text-secondary opacity-60 w-5 h-5">{icon}</div>}
      </div>

      {/* Number Value & Trend line */}
      <div className="flex items-baseline space-x-2.5 z-10">
        <span className="text-3xl font-black tracking-tight text-text-primary font-display">
          {value}
        </span>
        {trend && (
          <span
            className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border tracking-wide ${
              trend.isPositive
                ? 'bg-available/10 text-available border-available/20'
                : 'bg-occupied/10 text-occupied border-occupied/20'
            }`}
          >
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>

      {/* Footer Subtext */}
      {subtext && (
        <p className="mt-3 text-[10px] font-semibold text-text-muted tracking-wide z-10">
          {subtext}
        </p>
      )}
    </GlassCard>
  );
}
