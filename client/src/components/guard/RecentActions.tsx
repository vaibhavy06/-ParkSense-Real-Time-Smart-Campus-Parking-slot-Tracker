'use client';

import React from 'react';

export interface GuardActionLog {
  id: string;
  slotCode: string;
  vehicleNo: string;
  action: 'ENTRY' | 'EXIT';
  timestamp: string;
}

interface RecentActionsProps {
  logs: GuardActionLog[];
}

export default function RecentActions({ logs }: RecentActionsProps) {
  const getActionBadge = (action: 'ENTRY' | 'EXIT') => {
    if (action === 'ENTRY') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-available-light text-available tracking-wider">
          ENTRY
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-occupied-light text-occupied tracking-wider">
        EXIT
      </span>
    );
  };

  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary dark:text-gray-400">
          Gate Logs Audit Feed
        </h3>
        <span className="text-[10px] text-text-secondary dark:text-gray-500 font-mono">
          Last {logs.length} operations
        </span>
      </div>

      <div className="bg-card border border-border-custom rounded-3xl overflow-hidden shadow-sm dark:bg-bg-dark-card dark:border-border transition-all">
        {logs.length === 0 ? (
          <div className="p-8 text-center text-xs text-text-secondary dark:text-gray-500 italic">
            No gate activities logged during this shift yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {logs.map((log, index) => (
              <div
                key={log.id || index}
                className="p-4 flex items-center justify-between transition-all hover:bg-gray-50/50 dark:hover:bg-bg-dark/10"
              >
                <div className="flex items-center space-x-4">
                  {/* Action Icon */}
                  {getActionBadge(log.action)}
                  
                  <div>
                    {/* Vehicle and Slot */}
                    <div className="text-sm font-bold text-text-primary dark:text-gray-200">
                      Vehicle <span className="font-mono">{log.vehicleNo}</span>
                    </div>
                    <div className="text-[10px] text-text-secondary dark:text-gray-400">
                      Assigned Spot: <span className="font-mono font-bold text-primary dark:text-blue-400">{log.slotCode}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  {/* Timestamp */}
                  <span className="font-mono text-xs font-semibold text-text-secondary dark:text-gray-400">
                    {formatTime(log.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
