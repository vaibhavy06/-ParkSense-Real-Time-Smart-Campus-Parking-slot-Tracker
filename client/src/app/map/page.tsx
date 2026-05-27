'use client';

import React, { useState, useEffect } from 'react';
import { useSlots } from '../../hooks/useSlots';
import { useReservation } from '../../hooks/useReservation';
import { useSocket } from '../../hooks/useSocket';
import { useAuth } from '../../hooks/useAuth';
import CampusMap from '../../components/map/CampusMap';
import MapControls from '../../components/map/MapControls';
import MapLegend from '../../components/map/MapLegend';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/TopBar';
import StatCard from '../../components/ui/StatCard';
import ZoneSummaryPanel from '../../components/panels/ZoneSummaryPanel';
import MyReservationCard from '../../components/panels/MyReservationCard';
import { SlotData } from '../../store/slotStore';
import { useRouter } from 'next/navigation';
import { Database, CheckCircle2, AlertOctagon, Clock, BellRing, Sparkles } from 'lucide-react';

export default function LiveMapPage() {
  const router = useRouter();
  
  // Real-time synchronization
  useSocket();
  const { slots, zones, isLoading, refetch } = useSlots();
  const { activeReservation } = useReservation();
  const { user, isAuthenticated } = useAuth();

  // Filters state
  const [selectedZone, setSelectedZone] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [highlightedSlotId, setHighlightedSlotId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Already authenticated guard
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Keyboard shortcut "F" for Find Nearest
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'f' && e.target instanceof HTMLBodyElement) {
        e.preventDefault();
        handleFindNearest();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slots, user]);

  const handleFindNearest = () => {
    if (!user) return;

    // Filter available, active slots
    const availableSlots = slots.filter(
      (slot) => slot.status === 'AVAILABLE' && !slot.isDisabled
    );

    if (availableSlots.length === 0) {
      showToast('⚠️ No available parking slots found on campus right now.');
      return;
    }

    // Filter by role:
    // Students can park in A, B, C. Faculty can park only in Faculty Zone (Zone D)
    const roleFilteredSlots = availableSlots.filter((slot) => {
      const isFacultyZone = slot.zone.name.toLowerCase().includes('faculty');
      if (user.role === 'STUDENT') return !isFacultyZone;
      if (user.role === 'FACULTY') return isFacultyZone;
      return true; // Guards/Admins can see any nearest
    });

    if (roleFilteredSlots.length === 0) {
      showToast('⚠️ No available spots matching your user role permissions.');
      return;
    }

    // Distance Geometry: Campus Main Gate entryway is at coordinate (x=15, y=450)
    // Find slot with minimum Euclidean distance to gate
    let nearestSlot: SlotData | null = null;
    let minDistance = Infinity;

    roleFilteredSlots.forEach((slot) => {
      const dx = slot.x - 15;
      const dy = slot.y - 450;
      const distance = dx * dx + dy * dy; // Euclidean distance squared (fast check)

      if (distance < minDistance) {
        minDistance = distance;
        nearestSlot = slot;
      }
    });

    if (nearestSlot) {
      const slot = nearestSlot as SlotData;
      setHighlightedSlotId(slot.id);
      
      const zoneName = slot.zone.name.split(' - ')[0];
      showToast(`⚡ Spot ${slot.slotCode} in ${zoneName} is closest to Gate! Highlighting...`);

      // Clear highlight after 6s
      setTimeout(() => {
        setHighlightedSlotId(null);
      }, 6000);
    }
  };

  const handleReserve = async (slot: SlotData) => {
    if (!user) return;
    
    // Redirect to confirmation screen inside /reserve wizard directly
    router.push(`/reserve?slotId=${slot.id}`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  if (isLoading || !user) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-bg-base">
        <div className="w-10 h-10 rounded-full border-4 border-accent border-t-transparent animate-spin" />
        <span className="text-xs font-bold uppercase tracking-widest text-text-secondary mt-4">
          Syncing Live Campus Telemetry...
        </span>
      </div>
    );
  }

  // Stats aggregation
  const totalSlotsCount = slots.length;
  const availableSlotsCount = slots.filter((s) => s.status === 'AVAILABLE' && !s.isDisabled).length;
  const occupiedSlotsCount = slots.filter((s) => s.status === 'OCCUPIED').length;
  const reservedSlotsCount = slots.filter((s) => s.status === 'RESERVED').length;

  return (
    <div className="min-h-screen bg-bg-base flex transition-colors duration-300">
      {/* Collapsible Sidebar */}
      <Sidebar />

      {/* Main Content Area shifted left in desktop to fit sidebar */}
      <div className="flex-1 md:pl-16 flex flex-col min-h-screen relative z-10">
        
        {/* Topbar HUD */}
        <TopBar />

        {/* Dash Grid */}
        <main className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-24 lg:pb-12">
          
          {/* Left Columns Map: Span 8 columns */}
          <div className="lg:col-span-8 flex flex-col space-y-4">
            
            {/* Control Panel Deck */}
            <MapControls
              selectedZone={selectedZone}
              setSelectedZone={setSelectedZone}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              onFindNearest={handleFindNearest}
            />

            {/* Glowing Interactive SVG Canvas Map */}
            <CampusMap
              slots={slots}
              zones={zones}
              selectedZone={selectedZone}
              selectedStatus={selectedStatus}
              highlightedSlotId={highlightedSlotId}
              setHighlightedSlotId={setHighlightedSlotId}
              onReserve={handleReserve}
            />

            {/* Neon Swatch Legend Map */}
            <MapLegend />
          </div>

          {/* Right Columns Panels: Span 4 columns */}
          <div className="lg:col-span-4 flex flex-col space-y-6">
            
            {/* Live Hold Reservation (if any) */}
            <MyReservationCard />

            {/* Premium Stat Grid */}
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                title="Total Spots"
                value={totalSlotsCount}
                icon={<Database className="w-full h-full" />}
                glowColor="accent"
                subtext="AKTU Node Active"
              />
              <StatCard
                title="Available"
                value={availableSlotsCount}
                icon={<CheckCircle2 className="w-full h-full text-available" />}
                glowColor="available"
                subtext="Ready to Park"
              />
              <StatCard
                title="Occupied"
                value={occupiedSlotsCount}
                icon={<AlertOctagon className="w-full h-full text-occupied" />}
                glowColor="occupied"
                subtext="Live Telemetry"
              />
              <StatCard
                title="Reserved"
                value={reservedSlotsCount}
                icon={<Clock className="w-full h-full text-reserved" />}
                glowColor="reserved"
                subtext="15m Active Holds"
              />
            </div>

            {/* Horizontal Occupancy telemetry bars list */}
            <ZoneSummaryPanel
              zones={zones}
              selectedZone={selectedZone}
              setSelectedZone={setSelectedZone}
            />
          </div>
        </main>
      </div>

      {/* Floating Notification Alerts */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 p-4 rounded-2xl border border-glass-border bg-bg-surface/90 backdrop-blur-xl text-text-primary text-xs font-black tracking-wide shadow-2xl flex items-center space-x-2 animate-bounce">
          <BellRing className="w-4 h-4 text-accent animate-pulse" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-[10px] text-text-secondary ml-2 hover:text-text-primary">
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
