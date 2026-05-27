'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LinkNext from 'next/link';
import { useAuthStore } from '../store/authStore';
import HeroCarIllustration from '../components/vehicles/HeroCarIllustration';
import { Sparkles, ArrowRight, ShieldCheck, Cpu, Smartphone, Car, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [stats, setStats] = useState({ total: 90, available: 42, occupied: 38, reserved: 10 });
  const [loading, setLoading] = useState(true);

  // Fetch real live slot statistics from backend API
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/slots');
        if (res.ok) {
          const slots = await res.json();
          if (Array.isArray(slots)) {
            const total = slots.length;
            const available = slots.filter((s: any) => s.status === 'AVAILABLE' && !s.isDisabled).length;
            const occupied = slots.filter((s: any) => s.status === 'OCCUPIED').length;
            const reserved = slots.filter((s: any) => s.status === 'RESERVED').length;
            const disabled = slots.filter((s: any) => s.status === 'DISABLED' || s.isDisabled).length;
            setStats({ total, available, occupied, reserved });
          }
        }
      } catch (err) {
        console.error('Failed to fetch slot counts for landing page:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
    
    // Auto-update stats every 5 seconds for real-time vibe
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const getDashboardRoute = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin';
    if (user.role === 'GUARD') return '/guard';
    return '/map';
  };

  return (
    <div className="relative min-h-screen bg-bg-base overflow-x-hidden text-text-primary selection:bg-accent selection:text-white font-body bg-glow-radial">
      {/* Decorative top grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Header Bar */}
      <header className="relative z-50 max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-glass-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-[#1e3a8a] flex items-center justify-center shadow-[0_0_20px_var(--accent-glow)] border border-accent/40">
            <span className="font-mono font-black text-lg text-white">P</span>
          </div>
          <div>
            <span className="text-lg font-black tracking-widest text-[#F0F2FF] font-display">PARKSENSE</span>
            <span className="text-[8px] font-black tracking-widest text-accent uppercase block -mt-1 font-mono">AKTU Smart Campus</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-xs font-bold uppercase tracking-widest text-text-secondary hover:text-text-primary transition-colors">Features</a>
          <a href="#stats" className="text-xs font-bold uppercase tracking-widest text-text-secondary hover:text-text-primary transition-colors">Telemetry</a>
          <a href="#about" className="text-xs font-bold uppercase tracking-widest text-text-secondary hover:text-text-primary transition-colors">About</a>
        </nav>

        <div>
          {isAuthenticated ? (
            <LinkNext
              href={getDashboardRoute()}
              className="px-5 py-2.5 rounded-xl border border-accent bg-accent/15 text-[#F0F2FF] text-xs font-black tracking-widest uppercase shadow-[0_0_15px_rgba(79,142,247,0.15)] hover:bg-accent hover:shadow-[0_0_20px_rgba(79,142,247,0.3)] transition-all"
            >
              Enter Telemetry
            </LinkNext>
          ) : (
            <div className="flex items-center space-x-3">
              <LinkNext href="/login" className="text-xs font-black uppercase tracking-widest text-text-secondary hover:text-text-primary px-4 py-2 transition-colors">
                Sign In
              </LinkNext>
              <LinkNext
                href="/register"
                className="px-5 py-2.5 rounded-xl bg-accent text-[#F0F2FF] text-xs font-black tracking-widest uppercase shadow-[0_0_15px_rgba(79,142,247,0.2)] hover:bg-opacity-90 hover:shadow-[0_0_25px_var(--accent-glow)] transition-all active:scale-[0.98]"
              >
                Register
              </LinkNext>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column Text */}
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center space-x-2 bg-accent/10 border border-accent/30 px-3 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-accent font-mono">
              Live IoT Smart Campus Parking
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-text-primary leading-[1.08] uppercase">
            Smart College <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-[#A78BFA] to-accent bg-size-200">
              Parking Telemetry
            </span>
          </h1>

          <p className="text-base text-text-secondary max-w-2xl leading-relaxed">
            ParkSense delivers real-time spatial navigation and slot telemetry for AKTU-affiliated engineering colleges in India. Say goodbye to endless cruising. Reserve slots, track occupancy, and enter with digital QR gate clearance.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4 py-4 max-w-lg">
            <div className="bg-bg-surface/50 border border-glass-border p-4 rounded-2xl shadow-inner">
              <span className="text-2xl font-black font-mono text-accent block">
                {loading ? '---' : stats.total}
              </span>
              <span className="text-[10px] uppercase font-bold text-text-secondary tracking-wider block mt-1">
                Total Slots
              </span>
            </div>
            <div className="bg-bg-surface/50 border border-glass-border p-4 rounded-2xl shadow-inner">
              <span className="text-2xl font-black font-mono text-available block">
                {loading ? '---' : stats.available}
              </span>
              <span className="text-[10px] uppercase font-bold text-text-secondary tracking-wider block mt-1">
                Available
              </span>
            </div>
            <div className="bg-bg-surface/50 border border-glass-border p-4 rounded-2xl shadow-inner">
              <span className="text-2xl font-black font-mono text-reserved block">
                {loading ? '---' : `${Math.round(((stats.occupied + stats.reserved) / stats.total) * 100)}%`}
              </span>
              <span className="text-[10px] uppercase font-bold text-text-secondary tracking-wider block mt-1">
                Occupied
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <LinkNext
              href={isAuthenticated ? getDashboardRoute() : '/login'}
              className="group flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl bg-accent text-[#F0F2FF] font-black text-xs tracking-widest uppercase shadow-[0_4px_25px_rgba(79,142,247,0.3)] hover:shadow-[0_0_30px_var(--accent-glow)] transition-all active:scale-[0.98]"
            >
              <span>{isAuthenticated ? 'View Telemetry Map' : 'Reserve Slot Now'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </LinkNext>
            <LinkNext
              href="/login"
              className="flex items-center justify-center px-8 py-4 rounded-2xl border border-glass-border hover:border-glass-border-hover bg-bg-surface/40 hover:bg-bg-surface/70 text-text-secondary hover:text-text-primary text-xs font-black tracking-widest uppercase transition-all"
            >
              Security Gate Console
            </LinkNext>
          </div>
        </div>

        {/* Right Column Graphic */}
        <div className="lg:col-span-5 relative flex flex-col items-center">
          {/* Animated Isometric Parking Grid Overlay */}
          <div className="relative w-full aspect-[4/3] rounded-3xl border border-glass-border bg-bg-surface/30 backdrop-blur-sm p-4 overflow-hidden shadow-2xl">
            {/* Background cyber grid */}
            <svg viewBox="0 0 320 240" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
              {/* Isometric roads */}
              <line x1="40" y1="200" x2="280" y2="40" stroke="rgba(79, 142, 247, 0.15)" strokeWidth="16" strokeLinecap="round" />
              <line x1="40" y1="200" x2="280" y2="40" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="6,8" opacity="0.4" />

              {/* Parking bays (isometric outlines) */}
              {/* Slot 1 */}
              <polygon points="120,95 140,85 155,95 135,105" fill="rgba(0, 230, 118, 0.1)" stroke="var(--available)" strokeWidth="1" strokeDasharray="3,2" />
              <text x="137" y="97" fill="var(--available)" opacity="0.6" fontSize="6px" fontFamily="var(--font-mono)" textAnchor="middle">A1</text>

              {/* Slot 2 */}
              <polygon points="150,75 170,65 185,75 165,85" fill="rgba(255, 75, 75, 0.1)" stroke="var(--occupied)" strokeWidth="1" />
              <path d="M 160 76 L 175 69" stroke="var(--occupied)" strokeWidth="2.5" strokeLinecap="round" />

              {/* Slot 3 */}
              <polygon points="180,55 200,45 215,55 195,65" fill="rgba(255, 179, 0, 0.1)" stroke="var(--reserved)" strokeWidth="1" />
              {/* Little pulsing reserved orb */}
              <circle cx="197" cy="55" r="2.5" fill="var(--reserved)" className="animate-ping" />

              {/* Looping Car Driving along the road */}
              <g className="animate-drive-loop">
                <g transform="translate(10, 10)">
                  {/* Cyber topdown mini vector car */}
                  <path d="M 120 180 C 122 176, 126 172, 132 172 C 138 172, 142 176, 144 180" fill="var(--accent)" stroke="#F0F2FF" strokeWidth="1" />
                  <rect x="123" y="180" width="18" height="6" rx="2" fill="var(--accent)" />
                  {/* Neon light beams */}
                  <polygon points="120,180 105,175 105,185" fill="rgba(79, 142, 247, 0.3)" />
                </g>
              </g>
            </svg>
          </div>

          {/* Hero Car Side Profile stack */}
          <div className="w-full mt-4">
            <HeroCarIllustration />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-glass-border">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-xs font-black uppercase tracking-widest text-accent font-mono">
            Platform Infrastructure
          </h2>
          <p className="text-3xl font-black font-display tracking-tight uppercase text-text-primary">
            Built for High-Traffic Campuses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-3xl border border-glass-border bg-bg-surface/50 backdrop-blur-sm shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black uppercase tracking-wider text-text-primary">
              IoT Sensor-Ready
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Equipped with magnetic, infrared, and computer vision node integrations. Capable of instant spatial occupancy updates with zero latency overhead.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl border border-glass-border bg-bg-surface/50 backdrop-blur-sm shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-available/10 border border-available/30 flex items-center justify-center text-available">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black uppercase tracking-wider text-text-primary">
              15-Min Reservation Hold
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Book your slot 15 minutes before arrival. The intelligent campus boundary guard system automatically clears your reservation upon entry log.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl border border-glass-border bg-bg-surface/50 backdrop-blur-sm shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-reserved/10 border border-reserved/30 flex items-center justify-center text-reserved">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black uppercase tracking-wider text-text-primary">
              Guard Gate Interface
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              A comprehensive security guard gate terminal for quick entry and exit logs. Keep a secure audit of student and faculty vehicles on site.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-glass-border bg-bg-surface/30">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-text-secondary">
          <div className="flex items-center space-x-2">
            <span className="font-mono font-black text-text-primary tracking-widest uppercase">PARKSENSE</span>
            <span>|</span>
            <span>© 2026 ParkSense IoT. All rights reserved.</span>
          </div>
          <div className="flex space-x-6 font-bold uppercase tracking-wider">
            <LinkNext href="/login" className="hover:text-text-primary transition-colors">Guard Console</LinkNext>
            <LinkNext href="/register" className="hover:text-text-primary transition-colors">Create Account</LinkNext>
            <LinkNext href="/login" className="hover:text-text-primary transition-colors">Admin Login</LinkNext>
          </div>
        </div>
      </footer>
    </div>
  );
}
