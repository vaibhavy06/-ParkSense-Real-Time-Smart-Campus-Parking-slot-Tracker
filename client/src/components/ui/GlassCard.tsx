import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
  glowColor?: 'available' | 'occupied' | 'reserved' | 'accent' | string;
  className?: string;
}

export default function GlassCard({
  children,
  hoverable = false,
  glowColor,
  className = '',
  ...props
}: GlassCardProps) {
  
  const glowStyles = {
    available: 'hover:shadow-[0_0_20px_-3px_var(--available)] hover:border-available/30',
    occupied: 'hover:shadow-[0_0_20px_-3px_var(--occupied)] hover:border-occupied/30',
    reserved: 'hover:shadow-[0_0_20px_-3px_var(--reserved)] hover:border-reserved/30',
    accent: 'hover:shadow-[0_0_20px_-3px_var(--accent)] hover:border-accent/30',
  };

  const currentGlow = glowColor ? glowStyles[glowColor as keyof typeof glowStyles] || '' : '';

  return (
    <div
      className={`relative bg-bg-card border border-glass-border backdrop-blur-[20px] rounded-3xl p-6 transition-all duration-300 ${
        hoverable 
          ? 'hover:bg-bg-card-hover hover:border-glass-border-hover hover:-translate-y-[2px] hover:shadow-lg' 
          : ''
      } ${currentGlow} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
