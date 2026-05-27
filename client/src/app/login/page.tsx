'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import HeroCarIllustration from '../../components/vehicles/HeroCarIllustration';
import { Mail, Lock, ShieldAlert, Sparkles, KeyRound, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggingIn, loginError, isAuthenticated, user } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Already authenticated check
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'ADMIN') router.push('/admin');
      else if (user.role === 'GUARD') router.push('/guard');
      else router.push('/map');
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch (err) {
      // Handled by hook
    }
  };

  // Demo Login Helper
  const handleQuickLogin = async (demoEmail: string, demoPass: string) => {
    try {
      await login({ email: demoEmail, password: demoPass });
    } catch (err) {}
  };

  const demoAccounts = [
    { label: 'Admin Telemetry', email: 'admin@parksense.in', pass: 'admin123', color: 'border-rose-500/30 bg-rose-950/20 text-rose-400 hover:bg-rose-900/20 hover:border-rose-500' },
    { label: 'Gate Security', email: 'guard@parksense.in', pass: 'guard123', color: 'border-indigo-500/30 bg-indigo-950/20 text-indigo-400 hover:bg-indigo-900/20 hover:border-indigo-500' },
    { label: 'Student Terminal', email: 'student1@parksense.in', pass: 'student123', color: 'border-blue-500/30 bg-blue-950/20 text-blue-400 hover:bg-blue-900/20 hover:border-blue-500' },
    { label: 'Faculty Hub', email: 'faculty@parksense.in', pass: 'faculty123', color: 'border-purple-500/30 bg-purple-950/20 text-purple-400 hover:bg-purple-900/20 hover:border-purple-500' },
  ];

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-bg-base overflow-x-hidden selection:bg-accent selection:text-white font-body bg-glow-radial">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Left Screen: Premium Brand Telemetry Dashboard */}
      <div className="hidden lg:flex lg:col-span-6 relative flex-col justify-between p-12 border-r border-glass-border bg-bg-base/30 backdrop-blur-sm overflow-hidden">
        {/* Glow orb */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-glow/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Brand logo header */}
        <Link href="/" className="flex items-center space-x-3 relative z-10 hover:opacity-90 transition-opacity">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-[#1e3a8a] flex items-center justify-center shadow-[0_0_20px_var(--accent-glow)] border border-accent/40">
            <span className="font-mono font-black text-lg text-white">P</span>
          </div>
          <div>
            <span className="text-base font-black tracking-widest text-[#F0F2FF] font-display">PARKSENSE</span>
            <span className="text-[7px] font-black tracking-widest text-accent uppercase block -mt-1 font-mono">AKTU Smart Campus</span>
          </div>
        </Link>

        {/* Center content car model */}
        <div className="relative z-10 my-auto py-12 flex flex-col items-center text-center space-y-8">
          <div className="inline-flex items-center space-x-2 bg-accent/10 border border-accent/30 px-3 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest text-accent font-mono">
              Live Vector Model Track
            </span>
          </div>

          <div className="w-full max-w-lg">
            <HeroCarIllustration />
          </div>

          <div className="space-y-3 max-w-md">
            <h2 className="text-2xl font-black font-display tracking-tight text-text-primary uppercase">
              AI-Powered College Parking
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              Experience the future of spatial college utilities. ParkSense provides student & faculty slot reservations, real-time security coordination, and custom visual telemetry.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-[10px] text-text-muted font-mono tracking-wider">
          PARKSENSE TELEMETRY DECK v2.0 • LIVE DATA STREAM ACTIVE
        </div>
      </div>

      {/* Right Screen: Frosted Glass Form Card */}
      <div className="lg:col-span-6 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl border border-glass-border bg-bg-surface/85 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          
          {/* Logo for mobile view */}
          <div className="flex lg:hidden items-center justify-center space-x-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-[#1e3a8a] flex items-center justify-center border border-accent/40 shadow-lg shadow-accent/20">
              <span className="font-mono font-black text-lg text-white">P</span>
            </div>
            <span className="text-lg font-black tracking-widest text-[#F0F2FF] font-display">PARKSENSE</span>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-black font-display text-text-primary uppercase tracking-tight">
              Sign In
            </h1>
            <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-accent mt-1.5 font-mono">
              Enter Credentials or Use Quick-Demo Keys
            </p>
          </div>

          {/* Regular Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-widest text-text-secondary">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-4 h-4 text-text-muted" />
                <input
                  type="email"
                  required
                  placeholder="e.g. student@parksense.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-glass-border bg-bg-base/30 text-text-primary text-sm focus:outline-none focus:border-accent hover:border-glass-border-hover focus:ring-1 focus:ring-accent-glow transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-widest text-text-secondary">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-text-muted" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-glass-border bg-bg-base/30 text-text-primary text-sm focus:outline-none focus:border-accent hover:border-glass-border-hover focus:ring-1 focus:ring-accent-glow transition-all"
                />
              </div>
            </div>

            {loginError && (
              <div className="flex items-start space-x-2 p-3 rounded-2xl bg-occupied/10 border border-occupied/20 text-xs font-bold text-occupied">
                <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{loginError.message || 'Credentials match failed.'}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-4 rounded-2xl bg-accent text-[#F0F2FF] font-black text-xs tracking-widest uppercase shadow-[0_4px_20px_rgba(79,142,247,0.25)] hover:bg-opacity-90 hover:shadow-[0_0_20px_var(--accent-glow)] transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isLoggingIn ? 'Logging you in...' : 'Enter Console'}
            </button>
          </form>

          {/* Register Redirect */}
          <div className="text-center mt-6 text-xs">
            <span className="text-text-secondary">New student? </span>
            <Link href="/register" className="text-accent font-black hover:underline tracking-wide">
              Create an Account
            </Link>
          </div>

          {/* Quick Demo Login Grid */}
          <div className="mt-8 pt-6 border-t border-glass-border">
            <h3 className="flex items-center justify-center space-x-1.5 text-[9px] font-black uppercase tracking-widest text-text-secondary mb-4">
              <KeyRound className="w-3.5 h-3.5 text-accent" />
              <span>Developer Demo Quick-Access</span>
            </h3>
            
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.label}
                  type="button"
                  onClick={() => handleQuickLogin(acc.email, acc.pass)}
                  disabled={isLoggingIn}
                  className={`py-2.5 px-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 duration-300 ${acc.color}`}
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

