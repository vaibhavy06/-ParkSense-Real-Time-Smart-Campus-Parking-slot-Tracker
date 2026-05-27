'use client';

import React from 'react';

interface StepperNavProps {
  currentStep: number; // 1 to 4
  className?: string;
}

export default function StepperNav({ currentStep, className = '' }: StepperNavProps) {
  const steps = [
    { num: 1, label: 'Select Zone' },
    { num: 2, label: 'Choose Slot' },
    { num: 3, label: 'Confirm Hold' },
    { num: 4, label: 'Ticket Issue' },
  ];

  return (
    <div className={`flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:justify-center md:space-x-8 py-4 ${className}`}>
      {steps.map((st, index) => {
        const isActive = currentStep === st.num;
        const isCompleted = currentStep > st.num;

        return (
          <React.Fragment key={st.num}>
            {/* Step circle pill */}
            <div className="flex items-center space-x-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black font-display transition-all duration-300 border ${
                  isActive
                    ? 'bg-accent text-white border-accent shadow-[0_0_12px_var(--accent)]'
                    : isCompleted
                      ? 'bg-available text-white border-available shadow-[0_0_12px_var(--available)]'
                      : 'bg-transparent text-text-muted border-disabled'
                }`}
              >
                {isCompleted ? '✓' : st.num}
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? 'text-accent dark:text-blue-400 font-black'
                    : isCompleted
                      ? 'text-available'
                      : 'text-text-muted'
                }`}
              >
                {st.label}
              </span>
            </div>

            {/* Stepper connecting bar */}
            {index < steps.length - 1 && (
              <div
                className={`hidden md:block h-0.5 w-10 rounded-full transition-all duration-300 ${
                  isCompleted ? 'bg-available' : 'bg-disabled/40'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
