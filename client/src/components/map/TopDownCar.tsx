'use client';

import React from 'react';
import TopDownSedan from '../vehicles/TopDownSedan';
import TopDownSUV from '../vehicles/TopDownSUV';
import TopDownMoto from '../vehicles/TopDownMoto';

interface TopDownCarProps {
  slotCode: string;
  className?: string;
}

export default function TopDownCar({ slotCode, className = '' }: TopDownCarProps) {
  // Deterministic vehicle type based on slot code:
  // Sedan (60%), SUV (25%), Motorcycle (15%)
  const codeNumber = parseInt(slotCode.split('-')[1]) || 1;
  const isSUV = codeNumber % 4 === 0; // ~25%
  const isMoto = codeNumber % 7 === 0; // ~15%

  // 6 Paint finishes cycling
  const colors = [
    '#4F8EF7', // Accent Blue
    '#FF4B4B', // Occupied Neon Red
    '#FFB300', // Reserved Amber
    '#00E676', // Available Green
    '#A78BFA', // Light Purple
    '#F97316', // Orange
  ];
  
  const color = colors[codeNumber % colors.length];

  if (isSUV) {
    return <TopDownSUV color={color} className={className} />;
  }

  if (isMoto) {
    return <TopDownMoto color={color} className={className} />;
  }

  // Sedan is most common
  return <TopDownSedan color={color} className={className} />;
}
