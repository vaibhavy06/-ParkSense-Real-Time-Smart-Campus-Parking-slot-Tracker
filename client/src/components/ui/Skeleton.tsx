import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
}

export default function Skeleton({ className = '', variant = 'rect' }: SkeletonProps) {
  const baseStyle = 'animate-pulse bg-slate-800/40 border border-white/[0.02] shadow-inner';
  
  const shapes = {
    rect: 'rounded-2xl',
    circle: 'rounded-full',
    text: 'h-4 rounded-lg w-full',
  };

  return (
    <div 
      className={`${baseStyle} ${shapes[variant]} ${className}`}
      style={{
        background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite linear',
      }}
    />
  );
}

// Inject standard shimmer keyframe style directly if not present in Tailwind layers
if (typeof document !== 'undefined') {
  const styleId = 'parksense-skeleton-keyframes';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
    `;
    document.head.appendChild(style);
  }
}
