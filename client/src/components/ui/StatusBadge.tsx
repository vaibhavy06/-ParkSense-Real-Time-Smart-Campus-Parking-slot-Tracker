import React from 'react';

interface StatusBadgeProps {
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'DISABLED' | string;
  className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const styles = {
    AVAILABLE: {
      bg: 'bg-available/10 text-available border-available/20 shadow-[0_0_10px_rgba(0,230,118,0.1)]',
      dot: 'bg-available',
      label: 'Available',
    },
    OCCUPIED: {
      bg: 'bg-occupied/10 text-occupied border-occupied/20 shadow-[0_0_10px_rgba(255,75,75,0.1)]',
      dot: 'bg-occupied',
      label: 'Occupied',
    },
    RESERVED: {
      bg: 'bg-reserved/10 text-reserved border-reserved/20 shadow-[0_0_10px_rgba(255,179,0,0.1)]',
      dot: 'bg-reserved',
      label: 'Reserved (15m)',
    },
    DISABLED: {
      bg: 'bg-disabled/20 text-text-secondary border-disabled/30',
      dot: 'bg-disabled',
      label: 'Disabled',
    },
  };

  const current = styles[status as keyof typeof styles] || {
    bg: 'bg-slate-800 text-slate-300 border-slate-700',
    dot: 'bg-slate-500',
    label: status,
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold font-display border backdrop-blur-[6px] tracking-wide uppercase ${current.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-2 animate-pulse ${current.dot}`} />
      {current.label}
    </span>
  );
}
