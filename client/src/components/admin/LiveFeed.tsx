'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface AdminLogItem {
  id: string;
  slotCode: string;
  vehicleNo: string | null;
  action: 'ENTRY' | 'EXIT' | string;
  timestamp: string;
  user?: {
    name: string;
    email: string;
    role: string;
  } | null;
}

interface LiveFeedProps {
  logs: AdminLogItem[];
}

export default function LiveFeed({ logs }: LiveFeedProps) {
  // Take last 15 logs
  const displayLogs = logs.slice(0, 15);

  const getActionBadge = (action: string) => {
    if (action === 'ENTRY') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-available-light text-available tracking-wider uppercase border border-green-200 dark:bg-green-950/20 dark:border-green-900/40">
          ENTRY
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-occupied-light text-occupied tracking-wider uppercase border border-red-200 dark:bg-red-950/20 dark:border-red-900/40">
        EXIT
      </span>
    );
  };

  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="w-full p-5 rounded-3xl bg-card border border-border-custom shadow-sm dark:bg-bg-dark-card dark:border-border transition-all">
      <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-gray-800 pb-3">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary dark:text-gray-200">
            Real-Time Gate Activity Ticker
          </h3>
          <p className="text-[10px] text-text-secondary dark:text-gray-500 mt-0.5">
            Automatic streaming live campus access logs.
          </p>
        </div>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
      </div>

      <div className="h-[360px] overflow-y-auto pr-1">
        {displayLogs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-text-secondary dark:text-gray-500 italic">
            Waiting for vehicles to enter or exit...
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {displayLogs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: -12, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="p-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 flex items-center justify-between hover:bg-gray-50 dark:border-gray-800 dark:bg-bg-dark/15 dark:hover:bg-bg-dark/30 transition-all shadow-sm"
                >
                  <div className="flex items-center space-x-3.5">
                    {getActionBadge(log.action)}
                    
                    <div>
                      <div className="text-xs font-extrabold text-text-primary dark:text-gray-200">
                        Vehicle: <span className="font-mono text-primary dark:text-blue-400">{log.vehicleNo || 'ANONYMOUS'}</span>
                      </div>
                      
                      <div className="text-[10px] text-text-secondary dark:text-gray-400 mt-0.5">
                        Driver: <span className="font-medium">{log.user?.name || 'Visitor / Guard update'}</span>
                        {log.user?.role && (
                          <span className="ml-1.5 px-1 py-0.2 rounded text-[8px] bg-gray-200/60 text-gray-500 dark:bg-gray-800 dark:text-gray-400 uppercase font-bold">
                            {log.user.role}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-white border border-gray-100 text-[10px] font-bold font-mono text-primary dark:bg-bg-dark-card dark:border-gray-800 dark:text-blue-400">
                      Slot {log.slotCode}
                    </span>
                    <span className="block font-mono text-[9px] text-text-secondary dark:text-gray-500 mt-1">
                      {formatTime(log.timestamp)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
