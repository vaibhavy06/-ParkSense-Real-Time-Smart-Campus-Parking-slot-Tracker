'use client';

import React from 'react';

interface ActionButtonsProps {
  onEntry: () => void;
  onExit: () => void;
  onOverrideStatus: (status: string) => void;
  isSubmitting: boolean;
  disabled: boolean;
}

export default function ActionButtons({
  onEntry,
  onExit,
  onOverrideStatus,
  isSubmitting,
  disabled,
}: ActionButtonsProps) {
  const statuses = ['AVAILABLE', 'OCCUPIED', 'RESERVED', 'DISABLED'];

  return (
    <div className="flex flex-col space-y-6">
      {/* Big Gate Touch Targets */}
      <div className="grid grid-cols-2 gap-4">
        {/* Mark Entry Button */}
        <button
          type="button"
          onClick={onEntry}
          disabled={disabled || isSubmitting}
          className="flex flex-col items-center justify-center p-6 rounded-3xl bg-available text-white shadow-md hover:bg-green-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-extrabold text-base uppercase tracking-wider">
            Mark Entry
          </span>
        </button>

        {/* Mark Exit Button */}
        <button
          type="button"
          onClick={onExit}
          disabled={disabled || isSubmitting}
          className="flex flex-col items-center justify-center p-6 rounded-3xl bg-occupied text-white shadow-md hover:bg-red-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-extrabold text-base uppercase tracking-wider">
            Mark Exit
          </span>
        </button>
      </div>

      {/* Manual Status Override */}
      <div className="p-4 rounded-2xl bg-gray-50 border border-border-custom dark:bg-bg-dark dark:border-border transition-all">
        <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-text-secondary dark:text-gray-400 mb-3">
          Quick Status Override
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {statuses.map((status) => {
            const colors = {
              AVAILABLE: 'hover:bg-available hover:text-white dark:hover:bg-available',
              OCCUPIED: 'hover:bg-occupied hover:text-white dark:hover:bg-occupied',
              RESERVED: 'hover:bg-reserved hover:text-white dark:hover:bg-reserved',
              DISABLED: 'hover:bg-disabled hover:text-white dark:hover:bg-disabled',
            };

            return (
              <button
                key={status}
                type="button"
                disabled={disabled || isSubmitting}
                onClick={() => onOverrideStatus(status)}
                className={`py-2 px-3 rounded-xl border border-border-custom text-[10px] font-bold tracking-wide uppercase transition-all bg-white hover:shadow dark:bg-bg-dark-card dark:border-gray-800 dark:text-gray-300 dark:hover:border-transparent ${
                  colors[status as keyof typeof colors]
                }`}
              >
                Set {status.toLowerCase()}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
