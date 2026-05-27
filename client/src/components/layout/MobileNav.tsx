'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import { Map, CalendarPlus, ShieldAlert, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { logout } = useAuth();

  if (!user) return null;

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 z-30 bg-bg-surface/85 border-t border-glass-border backdrop-blur-2xl px-6 flex items-center justify-around no-print">
      
      {/* 1. Map Icon Tab */}
      <Link href="/map" className="relative flex flex-col items-center justify-center w-12 h-12">
        <Map className={`w-5.5 h-5.5 transition-all ${isActive('/map') ? 'text-accent drop-shadow-[0_0_8px_var(--accent-glow)]' : 'text-text-secondary'}`} />
        <span className={`text-[8px] font-black uppercase mt-1 tracking-wider ${isActive('/map') ? 'text-accent' : 'text-text-secondary'}`}>
          Map
        </span>
        {isActive('/map') && <span className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />}
      </Link>

      {/* 2. Reserve Icon Tab */}
      <Link href="/reserve" className="relative flex flex-col items-center justify-center w-12 h-12">
        <CalendarPlus className={`w-5.5 h-5.5 transition-all ${isActive('/reserve') ? 'text-accent drop-shadow-[0_0_8px_var(--accent-glow)]' : 'text-text-secondary'}`} />
        <span className={`text-[8px] font-black uppercase mt-1 tracking-wider ${isActive('/reserve') ? 'text-accent' : 'text-text-secondary'}`}>
          Reserve
        </span>
        {isActive('/reserve') && <span className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />}
      </Link>

      {/* 3. Role Specific Link (Guard Gate Panel or Admin overview dashboard) */}
      {user.role === 'GUARD' && (
        <Link href="/guard" className="relative flex flex-col items-center justify-center w-12 h-12">
          <ShieldAlert className={`w-5.5 h-5.5 transition-all ${isActive('/guard') ? 'text-available drop-shadow-[0_0_8px_rgba(0,230,118,0.25)]' : 'text-text-secondary'}`} />
          <span className={`text-[8px] font-black uppercase mt-1 tracking-wider ${isActive('/guard') ? 'text-available' : 'text-text-secondary'}`}>
            Guard
          </span>
          {isActive('/guard') && <span className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-available animate-pulse" />}
        </Link>
      )}

      {user.role === 'ADMIN' && (
        <Link href="/admin" className="relative flex flex-col items-center justify-center w-12 h-12">
          <LayoutDashboard className={`w-5.5 h-5.5 transition-all ${isActive('/admin') ? 'text-occupied drop-shadow-[0_0_8px_rgba(255,75,75,0.25)]' : 'text-text-secondary'}`} />
          <span className={`text-[8px] font-black uppercase mt-1 tracking-wider ${isActive('/admin') ? 'text-occupied' : 'text-text-secondary'}`}>
            Admin
          </span>
          {isActive('/admin') && <span className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-occupied animate-pulse" />}
        </Link>
      )}

      {/* 4. Log Out Icon Tab */}
      <button 
        onClick={() => logout()}
        className="relative flex flex-col items-center justify-center w-12 h-12 text-text-secondary hover:text-occupied transition-all"
      >
        <LogOut className="w-5.5 h-5.5" />
        <span className="text-[8px] font-black uppercase mt-1 tracking-wider">
          Exit
        </span>
      </button>

    </nav>
  );
}
