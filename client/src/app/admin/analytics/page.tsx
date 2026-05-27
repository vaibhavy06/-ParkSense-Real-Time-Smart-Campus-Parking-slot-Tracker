'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import { useAnalytics } from '../../../hooks/useAnalytics';
import OccupancyChart from '../../../components/admin/OccupancyChart';
import ZoneUtilizationChart from '../../../components/admin/ZoneUtilizationChart';
import WeeklyTrendChart from '../../../components/admin/WeeklyTrendChart';
import PeakHeatmap from '../../../components/admin/PeakHeatmap';
import Sidebar from '../../../components/layout/Sidebar';
import TopBar from '../../../components/layout/TopBar';
import { Sparkles, RefreshCw, BarChart2 } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const {
    occupancyData,
    peakData,
    trendsData,
    zonesData,
    isLoading,
    refetchAll,
  } = useAnalytics();

  // Authenticate admin role
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user && user.role !== 'ADMIN') {
      router.push('/map');
    }
  }, [isAuthenticated, user, router]);

  if (!user || isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-bg-base">
        <div className="w-10 h-10 rounded-full border-4 border-accent border-t-transparent animate-spin" />
        <span className="text-xs font-bold uppercase tracking-widest text-text-secondary mt-4">
          Compiling Statistical Telemetry...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base flex transition-colors duration-300">
      {/* Collapsible Sidebar */}
      <Sidebar />

      {/* Main Content Area shifted left in desktop */}
      <div className="flex-1 md:pl-16 flex flex-col min-h-screen relative z-10">
        
        {/* Topbar HUD */}
        <TopBar />

        {/* Dash Grid */}
        <main className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6 pb-24 lg:pb-12">
          
          {/* Header & Quick Action */}
          <div className="flex items-center justify-between border-b border-glass-border/30 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-2 bg-accent/10 border border-accent/30 px-3 py-1.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-accent font-mono">
                  Telemetry Aggregation
                </span>
              </div>
              <h1 className="text-2xl font-black font-display text-text-primary uppercase tracking-tight">
                Spatial Parking Analytics
              </h1>
              <p className="text-xs text-text-secondary leading-relaxed font-bold uppercase tracking-wide">
                Aggregated utilization, trends, and slot efficiency metrics.
              </p>
            </div>

            <button
              onClick={refetchAll}
              className="flex items-center space-x-2 py-3 px-5 rounded-2xl bg-accent text-[#F0F2FF] hover:bg-opacity-90 font-black text-xs uppercase tracking-widest hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-300 active:scale-[0.98]"
            >
              <RefreshCw className="w-4 h-4 animate-spin-slow" />
              <span>Refresh Metrics</span>
            </button>
          </div>

          {/* Top Section Charts Grid: 24h Occupancy & Utilization */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-4 rounded-3xl border border-glass-border bg-bg-surface/60 backdrop-blur-md shadow-2xl">
              <OccupancyChart data={occupancyData} />
            </div>
            <div className="p-4 rounded-3xl border border-glass-border bg-bg-surface/60 backdrop-blur-md shadow-2xl">
              <ZoneUtilizationChart data={zonesData} />
            </div>
          </div>

          {/* Peak Heatmap Component Grid (takes full width) */}
          <div className="p-4 rounded-3xl border border-glass-border bg-bg-surface/60 backdrop-blur-md shadow-2xl">
            <PeakHeatmap />
          </div>

          {/* Bottom Section Chart: Weekly Gate Entries Area Chart */}
          <div className="p-4 rounded-3xl border border-glass-border bg-bg-surface/60 backdrop-blur-md shadow-2xl">
            <WeeklyTrendChart data={trendsData} />
          </div>

        </main>
      </div>
    </div>
  );
}
