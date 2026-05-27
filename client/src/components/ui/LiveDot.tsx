import React from 'react';

interface LiveDotProps {
  className?: string;
}

export default function LiveDot({ className = '' }: LiveDotProps) {
  return (
    <div className={`inline-flex items-center px-3.5 py-1.5 rounded-full bg-available-glow/10 border border-available/20 shadow-[0_0_12px_var(--available-dim)] ${className}`}>
      <span className="relative flex h-2 w-2 mr-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-available opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-available"></span>
      </span>
      <span className="text-[9px] font-black uppercase tracking-widest text-available font-mono">
        Live Update Stream
      </span>
    </div>
  );
}
