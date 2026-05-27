'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSlots } from '../../hooks/useSlots';
import { useAuth } from '../../hooks/useAuth';
import { apiFetch } from '../../utils/api';
import LiveFeed, { AdminLogItem } from '../../components/admin/LiveFeed';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/TopBar';
import StatCard from '../../components/ui/StatCard';
import { SlotData } from '../../store/slotStore';
import { ShieldCheck, Play, Pause, RefreshCw, Cpu, Layers, HelpCircle } from 'lucide-react';


export default function AdminOverviewPage() {
  const router = useRouter();
  const { slots, zones, isLoading: isSlotsLoading, refetch: refetchSlots } = useSlots();
  const { user, logout, isAuthenticated } = useAuth();

  // Admin specific states
  const [simulationEnabled, setSimulationEnabled] = useState(true);
  const [liveLogs, setLiveLogs] = useState<AdminLogItem[]>([]);
  const [isUpdatingSim, setIsUpdatingSim] = useState(false);

  // Authenticate admin role
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user && user.role !== 'ADMIN') {
      router.push('/map'); // unauthorized redirect
    }
  }, [isAuthenticated, user, router]);

  // Load simulator status and live logs
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Fetch simulator toggle state
        const simData = await apiFetch('/admin/simulation');
        setSimulationEnabled(simData.enabled);

        // Fetch paginated logs
        const logsData = await apiFetch('/logs?limit=15');
        const mappedLogs = logsData.logs.map((log: any) => ({
          id: log.id,
          slotCode: log.slot.slotCode,
          vehicleNo: log.vehicleNo,
          action: log.action,
          timestamp: log.timestamp,
          user: log.user,
        }));
        setLiveLogs(mappedLogs);
      } catch (err) {}
    };

    if (isAuthenticated && user?.role === 'ADMIN') {
      fetchAdminData();
      
      // Auto refresh logs every 20s to simulate live updates
      const logInterval = setInterval(fetchAdminData, 20000);
      return () => clearInterval(logInterval);
    }
  }, [isAuthenticated, user]);

  const handleToggleSimulation = async () => {
    setIsUpdatingSim(true);
    try {
      const data = await apiFetch('/admin/simulation', {
        method: 'PATCH',
        body: JSON.stringify({ enabled: !simulationEnabled }),
      });
      setSimulationEnabled(data.enabled);
    } catch (err) {
      alert('Failed to update simulator state.');
    } finally {
      setIsUpdatingSim(false);
    }
  };

  if (!user || isSlotsLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-bg-base">
        <div className="w-10 h-10 rounded-full border-4 border-accent border-t-transparent animate-spin" />
        <span className="text-xs font-bold uppercase tracking-widest text-text-secondary mt-4">
          Securing Admin Terminal...
        </span>
      </div>
    );
  }

  // Aggregate Metrics
  const totalSlotsCount = slots.length;
  const availableSlotsCount = slots.filter((s: SlotData) => s.status === 'AVAILABLE' && !s.isDisabled).length;
  const occupiedSlotsCount = slots.filter((s: SlotData) => s.status === 'OCCUPIED').length;
  const reservedSlotsCount = slots.filter((s: SlotData) => s.status === 'RESERVED').length;

  const occupancyRate = Math.round(
    ((occupiedSlotsCount + reservedSlotsCount) / (totalSlotsCount || 1)) * 100
  );

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
          
          {/* Executive metrics row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Parking Spots"
              value={totalSlotsCount}
              glowColor="accent"
              subtext="Pre-loaded grid spaces"
            />
            <StatCard
              title="Currently Free"
              value={availableSlotsCount}
              glowColor="available"
              trend={{ value: `${Math.round((availableSlotsCount/totalSlotsCount)*100)}%`, isPositive: true }}
              subtext="Available for reservations"
            />
            <StatCard
              title="Occupancy Density"
              value={`${occupancyRate}%`}
              glowColor="reserved"
              trend={{ value: 'Occupied/Reserved', isPositive: occupancyRate < 75 }}
              subtext="Includes active hold locks"
            />
            <StatCard
              title="Gate Transits (Today)"
              value="₹3,680"
              glowColor="occupied"
              trend={{ value: '+12% weekly', isPositive: true }}
              subtext="AKTU Student/Staff records"
            />
          </div>

          {/* Traffic Simulator Controls */}
          <div className="p-5 rounded-3xl border border-glass-border bg-bg-surface/50 backdrop-blur-md shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent shadow-[0_0_12px_rgba(79,142,247,0.15)]">
                <Cpu className="w-6 h-6 animate-spin-slow" />
              </div>
              <div>
                <h4 className="text-sm font-black text-text-primary uppercase tracking-wider">
                  Live Traffic Simulator Stream
                </h4>
                <p className="text-[10px] text-text-secondary leading-relaxed font-bold uppercase tracking-wide mt-0.5">
                  Simulates random car entry/exit telemetry updates inside dev matrices.
                </p>
              </div>
            </div>

            <button
              onClick={handleToggleSimulation}
              disabled={isUpdatingSim}
              className={`flex items-center justify-center space-x-2.5 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 active:scale-[0.97] disabled:opacity-50 ${
                simulationEnabled
                  ? 'bg-available text-[#F0F2FF] hover:shadow-[0_0_15px_var(--available-glow)]'
                  : 'bg-occupied text-[#F0F2FF] hover:shadow-[0_0_15px_var(--occupied-glow)]'
              }`}
            >
              {simulationEnabled ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isUpdatingSim ? 'Pending sync...' : simulationEnabled ? 'Pause Simulator' : 'Resume Simulator'}</span>
            </button>
          </div>

          {/* Configuration Tables and Audit Logs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Zone Configurations */}
            <div className="lg:col-span-2 p-6 rounded-3xl border border-glass-border bg-bg-surface/60 backdrop-blur-md shadow-2xl flex flex-col justify-between">
              <div>
                <h3 className="flex items-center text-xs font-black uppercase tracking-widest text-text-secondary mb-6 border-b border-glass-border/30 pb-3">
                  <Layers className="w-4.5 h-4.5 mr-2 text-accent" />
                  <span>Zone Telemetry Configurations</span>
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-bold text-text-secondary">
                    <thead>
                      <tr className="border-b border-glass-border/30 uppercase tracking-widest text-[9px] text-text-muted">
                        <th className="py-3 px-2">Zone Name</th>
                        <th className="py-3 px-2 text-center">Capacity</th>
                        <th className="py-3 px-2 text-center">Free Slots</th>
                        <th className="py-3 px-2">Allowed Roles</th>
                        <th className="py-3 px-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-glass-border/20 text-xs">
                      {zones.map((zone) => (
                        <tr key={zone.id} className="hover:bg-bg-base/20 transition-colors">
                          <td className="py-4 px-2 font-black text-text-primary">
                            {zone.name}
                          </td>
                          <td className="py-4 px-2 text-center font-mono font-black text-text-primary">
                            {zone.totalSlots}
                          </td>
                          <td className="py-4 px-2 text-center font-mono font-black text-available">
                            {zone.available}
                          </td>
                          <td className="py-4 px-2">
                            <div className="flex gap-1.5">
                              {zone.allowedRoles.map((role) => (
                                <span
                                  key={role}
                                  className="px-2 py-0.5 rounded text-[8px] bg-bg-base/80 text-text-secondary border border-glass-border uppercase font-black tracking-widest"
                                >
                                  {role}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-4 px-2 text-right">
                            <button
                              type="button"
                              className="px-3.5 py-1.5 rounded-xl border border-glass-border hover:border-glass-border-hover bg-bg-base/30 text-text-secondary hover:text-text-primary text-[10px] font-black uppercase tracking-wider transition-colors"
                              onClick={() => alert(`Zone Configuration override active: ${zone.totalSlots} spaces.`)}
                            >
                              Config
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-[10px] text-text-secondary/70 italic mt-8 border-t border-glass-border/30 pt-4">
                <HelpCircle className="w-3.5 h-3.5 text-text-muted" />
                <span>Security guard overriding triggers are cataloged in telemetry audits.</span>
              </div>
            </div>

            {/* Live Audit Log Feed */}
            <div className="lg:col-span-1">
              <LiveFeed logs={liveLogs} />
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
