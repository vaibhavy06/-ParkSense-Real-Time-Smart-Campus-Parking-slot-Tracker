'use client';

import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  expiresAt: string; // ISO String
  onExpire?: () => void;
  className?: string;
}

export default function CountdownTimer({ expiresAt, onExpire, className = '' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(expiresAt) - +new Date();
      return difference > 0 ? Math.floor(difference / 1000) : 0;
    };

    setTimeLeft(calculateTime());

    const timer = setInterval(() => {
      const remaining = calculateTime();
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        if (onExpire) onExpire();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, onExpire]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isLowTime = timeLeft <= 180; // 3 minutes warning

  return (
    <span
      className={`font-mono text-xl font-bold tracking-widest transition-all duration-300 ${
        isLowTime 
          ? 'text-occupied animate-pulse shadow-[0_0_15px_rgba(255,75,75,0.4)] px-2 py-0.5 rounded-lg border border-occupied/30 bg-occupied/5' 
          : 'text-reserved'
      } ${className}`}
    >
      {formatted}
    </span>
  );
}
