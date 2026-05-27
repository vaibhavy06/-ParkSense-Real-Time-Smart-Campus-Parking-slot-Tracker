'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import { useAuth } from '../../hooks/useAuth';
import { 
  Map, 
  CalendarPlus, 
  History, 
  Bookmark, 
  LayoutDashboard, 
  Settings, 
  ShieldAlert, 
  TrendingUp, 
  LogOut,
  User,
  ChevronRight
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!user) return null;

  const mainLinks = [
    { label: 'Live Map', path: '/map', icon: Map },
    { label: 'Reserve Slot', path: '/reserve', icon: CalendarPlus },
    // { label: 'My Bookings', path: '/my-reservation', icon: Bookmark },
  ];

  const adminLinks = [
    { label: 'Admin Panel', path: '/admin', icon: LayoutDashboard },
    { label: 'Utilization Analytics', path: '/admin/analytics', icon: TrendingUp },
  ];

  const guardLinks = [
    { label: 'Gate Panel', path: '/guard', icon: ShieldAlert },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <aside
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={`fixed top-0 left-0 h-screen z-40 transition-all duration-300 ease-in-out hidden md:flex flex-col bg-bg-surface/85 border-r border-glass-border backdrop-blur-2xl ${
        isExpanded ? 'w-56' : 'w-16'
      }`}
    >
      {/* Brand Header */}
      <div className="h-20 flex items-center px-4 border-b border-glass-border relative overflow-hidden">
        <Link href="/map" className="flex items-center space-x-3.5 z-10">
          <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center text-white font-black text-lg shadow-[0_0_15px_var(--accent-glow)] select-none">
            P
          </div>
          {isExpanded && (
            <span className="font-display font-black text-base tracking-tight text-text-primary">
              Park<span className="text-accent">Sense</span>
            </span>
          )}
        </Link>
        {!isExpanded && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      {/* Nav Links Body */}
      <div className="flex-1 py-6 flex flex-col space-y-6 overflow-y-auto px-2">
        {/* Core Nav list */}
        <div className="space-y-1">
          {mainLinks.map((lnk) => {
            const Icon = lnk.icon;
            const active = isActive(lnk.path);
            return (
              <Link
                key={lnk.path}
                href={lnk.path}
                className={`flex items-center space-x-3.5 p-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  active
                    ? 'bg-accent/15 text-accent border border-accent/20 shadow-[0_0_12px_rgba(79,142,247,0.1)]'
                    : 'text-text-secondary border border-transparent hover:text-text-primary hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-accent' : ''}`} />
                {isExpanded && <span>{lnk.label}</span>}
              </Link>
            );
          })}
        </div>

        {/* Guard Duties (Guard/Admin Only) */}
        {(user.role === 'GUARD' || user.role === 'ADMIN') && (
          <div className="space-y-1.5 border-t border-glass-border/40 pt-4">
            {isExpanded && (
              <span className="px-2 text-[9px] font-black text-text-muted uppercase tracking-widest block mb-2">
                Shift Gate Duty
              </span>
            )}
            {guardLinks.map((lnk) => {
              const Icon = lnk.icon;
              const active = isActive(lnk.path);
              return (
                <Link
                  key={lnk.path}
                  href={lnk.path}
                  className={`flex items-center space-x-3.5 p-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    active
                      ? 'bg-emerald-500/10 text-available border border-available/20 shadow-[0_0_12px_rgba(0,230,118,0.1)]'
                      : 'text-text-secondary border border-transparent hover:text-text-primary hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {isExpanded && <span>{lnk.label}</span>}
                </Link>
              );
            })}
          </div>
        )}

        {/* Admin Dashboard (Admin Only) */}
        {user.role === 'ADMIN' && (
          <div className="space-y-1.5 border-t border-glass-border/40 pt-4">
            {isExpanded && (
              <span className="px-2 text-[9px] font-black text-text-muted uppercase tracking-widest block mb-2">
                Director Controls
              </span>
            )}
            {adminLinks.map((lnk) => {
              const Icon = lnk.icon;
              const active = isActive(lnk.path);
              return (
                <Link
                  key={lnk.path}
                  href={lnk.path}
                  className={`flex items-center space-x-3.5 p-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    active
                      ? 'bg-rose-500/10 text-occupied border border-occupied/20 shadow-[0_0_12px_rgba(255,75,75,0.1)]'
                      : 'text-text-secondary border border-transparent hover:text-text-primary hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {isExpanded && <span>{lnk.label}</span>}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* User Profile Footer */}
      <div className="border-t border-glass-border p-2 flex flex-col space-y-1">
        <div className="flex items-center space-x-3 p-2 rounded-xl transition-all">
          <div className="w-7 h-7 rounded-lg bg-slate-800 border border-glass-border flex items-center justify-center text-text-primary font-bold text-xs uppercase shadow-inner">
            {user.name.charAt(0)}
          </div>
          {isExpanded && (
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-black truncate text-text-primary leading-tight font-display">{user.name}</p>
              <span className="text-[9px] font-extrabold uppercase text-accent dark:text-blue-400 tracking-wider">
                {user.role}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => logout()}
          className="flex items-center space-x-3.5 p-3 rounded-xl text-xs font-bold uppercase text-occupied hover:bg-occupied/10 border border-transparent hover:border-occupied/20 transition-all w-full"
        >
          <LogOut className="w-4 h-4 flex-shrink-0 text-occupied" />
          {isExpanded && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
