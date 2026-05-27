'use client';

import React from 'react';

interface SlotInputProps {
  value: string;
  onChange: (value: string) => void;
  vehicleNo: string;
  setVehicleNo: (vehicle: string) => void;
  error?: string;
}

export default function SlotInput({ value, onChange, vehicleNo, setVehicleNo, error }: SlotInputProps) {
  return (
    <div className="flex flex-col space-y-4">
      {/* Slot Code Input */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary dark:text-gray-400">
          Target Slot Code (e.g. A-01, B-12)
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Type slot code..."
            value={value}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            className="w-full px-5 py-4 rounded-2xl border-2 border-border-custom bg-white text-2xl font-black font-mono tracking-wider focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-primary dark:bg-bg-dark-card dark:border-gray-800 dark:text-gray-100"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center text-text-secondary">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Vehicle Registration Input */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary dark:text-gray-400">
          Vehicle Number Plate (Required for Entry)
        </label>
        <input
          type="text"
          placeholder="e.g. UP32AB1234"
          value={vehicleNo}
          onChange={(e) => setVehicleNo(e.target.value.toUpperCase())}
          className="w-full px-5 py-3 rounded-2xl border border-border-custom bg-white text-lg font-bold font-mono tracking-wide focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-primary dark:bg-bg-dark-card dark:border-gray-800 dark:text-gray-100"
        />
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-600 dark:bg-red-950/20 dark:border-red-900/40 dark:text-red-400">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}
