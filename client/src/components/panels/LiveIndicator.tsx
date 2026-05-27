import React from 'react';

export default function LiveIndicator() {
  return (
    <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-green-50 border border-green-200 dark:bg-green-950/10 dark:border-green-900/30">
      <span className="relative flex h-2 w-2 mr-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest dark:text-green-400">
        Live Updates Active
      </span>
    </div>
  );
}
