'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import { useSlotStore } from '../../store/slotStore';
import { useReservationStore } from '../../store/reservationStore';
import { useProfileStore } from '../../store/profileStore';
import LiveDot from '../ui/LiveDot';
import RoleBadge from '../ui/RoleBadge';
import { Bell, User, Sparkles, Moon, Sun } from 'lucide-react';

export default function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();
  const { slots } = useSlotStore();
  const { activeReservation } = useReservationStore();
  const { setProfileOpen } = useProfileStore();

  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('parksense-theme') || 'dark';
    setIsLightMode(savedTheme === 'light');
    const html = document.documentElement;
    if (savedTheme === 'light') {
      html.classList.add('light');
    } else {
      html.classList.remove('light');
    }
  }, []);

  // Toggle Theme Helper
  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('light')) {
      html.classList.remove('light');
      setIsLightMode(false);
      localStorage.setItem('parksense-theme', 'dark');
    } else {
      html.classList.add('light');
      setIsLightMode(true);
      localStorage.setItem('parksense-theme', 'light');
    }
  };

  const getPageTitle = () => {
    if (pathname.includes('/map')) return 'Live Campus HUD';
    if (pathname.includes('/reserve')) return 'Secure Parking Spot';
    if (pathname.includes('/guard')) return 'Security Access Console';
    if (pathname.includes('/admin/analytics')) return 'Performance Analytics';
    if (pathname.includes('/admin')) return 'College Management Center';
    return 'ParkSense';
  };

  const availableCount = slots.filter((s) => s.status === 'AVAILABLE' && !s.isDisabled).length;

  return (
    <header className="sticky top-0 z-30 w-full bg-bg-surface/75 border-b border-glass-border backdrop-blur-md px-6 py-4 flex items-center justify-between no-print">
      
      {/* Page Title & Breadcrumbs */}
      <div>
        <h1 className="font-display font-black text-lg tracking-tight text-text-primary uppercase">
          {getPageTitle()}
        </h1>
        <p className="hidden sm:block text-[10px] text-text-secondary font-bold uppercase tracking-wider mt-0.5">
          AKTU CAMPUS NETWORK · PARKSENSE LIVE
        </p>
      </div>

      {/* Tickers & User Session */}
      <div className="flex items-center space-x-5">
        
        {/* Real-Time Live dot counter */}
        <div className="hidden sm:block">
          <div className="flex items-center space-x-3">
            <LiveDot />
            <div className="px-3.5 py-1.5 rounded-full bg-bg-card border border-glass-border flex items-center space-x-1.5 text-xs font-mono font-bold text-text-primary">
              <span className="text-accent">[{availableCount}]</span>
              <span className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">Free spots</span>
            </div>
          </div>
        </div>

        {/* Theme Toggler */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-bg-card border border-glass-border hover:border-glass-border-hover text-text-secondary hover:text-text-primary transition-all active:scale-95"
          title="Toggle Light/Dark Theme"
        >
          {isLightMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* Notifications Indicator */}
        <div className="relative cursor-pointer" onClick={() => router.push('/reserve')}>
          <button className="p-2.5 rounded-xl bg-bg-card border border-glass-border hover:border-glass-border-hover text-text-secondary hover:text-text-primary transition-all">
            <Bell className="w-4 h-4" />
          </button>
          {activeReservation && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-reserved animate-ping" />
          )}
          {activeReservation && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-reserved border border-bg-surface" />
          )}
        </div>

        {/* User Session Profile card */}
        <div 
          onClick={() => setProfileOpen(true)}
          className="flex items-center space-x-3 pl-3 border-l border-glass-border cursor-pointer group hover:opacity-90 active:scale-98 transition-all"
          title="Edit Profile / Vehicle plate"
        >
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-text-primary leading-tight font-display group-hover:text-accent transition-colors">{user?.name}</p>
            {user?.role && <RoleBadge role={user.role} className="mt-0.5" />}
          </div>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent to-blue-700 border border-glass-border flex items-center justify-center text-white font-bold text-sm uppercase shadow shadow-blue-500/20 group-hover:scale-105 transition-all">
            {user?.name.charAt(0) || <User className="w-4 h-4" />}
          </div>
        </div>


      </div>
    </header>
  );
}
