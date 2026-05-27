'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSlots } from '../../hooks/useSlots';
import { useAuth } from '../../hooks/useAuth';
import { apiFetch } from '../../utils/api';
import SlotInput from '../../components/guard/SlotInput';
import ActionButtons from '../../components/guard/ActionButtons';
import RecentActions, { GuardActionLog } from '../../components/guard/RecentActions';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/TopBar';
import { Sparkles, ShieldCheck, Printer, AlertTriangle, KeyRound } from 'lucide-react';

export default function GuardGatePage() {
  const router = useRouter();
  const { slots, refetch: refetchSlots } = useSlots();
  const { user, logout, isAuthenticated } = useAuth();

  // Guard inputs
  const [slotCode, setSlotCode] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentLogs, setRecentLogs] = useState<GuardActionLog[]>([]);

  // Authenticate guard role
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user && user.role !== 'GUARD' && user.role !== 'ADMIN') {
      router.push('/map'); // unauthorized redirect
    }
  }, [isAuthenticated, user, router]);

  // Load initial gate logs
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await apiFetch('/logs?limit=10');
        // Map backend logs to our GuardActionLog structure
        const mappedLogs = data.logs.map((log: any) => ({
          id: log.id,
          slotCode: log.slot.slotCode,
          vehicleNo: log.vehicleNo || 'ANONYMOUS',
          action: log.action,
          timestamp: log.timestamp,
        }));
        setRecentLogs(mappedLogs);
      } catch (err) {}
    };

    if (isAuthenticated) fetchLogs();
  }, [isAuthenticated]);

  const findSlotByCode = (code: string) => {
    return slots.find((s) => s.slotCode.trim().toUpperCase() === code.trim().toUpperCase());
  };

  const handleEntry = async () => {
    setError(undefined);
    setSuccess(undefined);

    if (!slotCode.trim()) {
      setError('Please specify a slot code (e.g. A-01).');
      return;
    }

    if (!vehicleNo.trim()) {
      setError('Please provide a vehicle registration plate number.');
      return;
    }

    const slot = findSlotByCode(slotCode);
    if (!slot) {
      setError(`Slot "${slotCode}" not found on campus map.`);
      return;
    }

    if (slot.status === 'OCCUPIED') {
      setError(`Slot "${slotCode}" is already marked as OCCUPIED.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await apiFetch('/logs', {
        method: 'POST',
        body: JSON.stringify({
          slotId: slot.id,
          vehicleNo: vehicleNo.trim().toUpperCase(),
          action: 'ENTRY',
        }),
      });

      setSuccess(`✅ Successfully logged ENTRY for vehicle ${vehicleNo.toUpperCase()} at slot ${slotCode}!`);
      
      // Update shift audit feed locally
      const newLog: GuardActionLog = {
        id: data.log.id,
        slotCode,
        vehicleNo: vehicleNo.trim().toUpperCase(),
        action: 'ENTRY',
        timestamp: new Date().toISOString(),
      };
      setRecentLogs((prev) => [newLog, ...prev.slice(0, 9)]);

      // Reset fields
      setSlotCode('');
      setVehicleNo('');
      refetchSlots();
    } catch (err: any) {
      setError(err.message || 'Failed to submit entry event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExit = async () => {
    setError(undefined);
    setSuccess(undefined);

    if (!slotCode.trim()) {
      setError('Please specify a slot code (e.g. A-01).');
      return;
    }

    const slot = findSlotByCode(slotCode);
    if (!slot) {
      setError(`Slot "${slotCode}" not found on campus map.`);
      return;
    }

    if (slot.status === 'AVAILABLE') {
      setError(`Slot "${slotCode}" is already AVAILABLE.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await apiFetch('/logs', {
        method: 'POST',
        body: JSON.stringify({
          slotId: slot.id,
          action: 'EXIT',
          vehicleNo: vehicleNo.trim() || undefined,
        }),
      });

      setSuccess(`✅ Successfully logged EXIT at slot ${slotCode}. Spot is now AVAILABLE!`);
      
      const newLog: GuardActionLog = {
        id: data.log.id,
        slotCode,
        vehicleNo: data.log.vehicleNo || 'DEPARTED',
        action: 'EXIT',
        timestamp: new Date().toISOString(),
      };
      setRecentLogs((prev) => [newLog, ...prev.slice(0, 9)]);

      setSlotCode('');
      setVehicleNo('');
      refetchSlots();
    } catch (err: any) {
      setError(err.message || 'Failed to submit exit event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverrideStatus = async (status: string) => {
    setError(undefined);
    setSuccess(undefined);

    if (!slotCode.trim()) {
      setError('Specify slot code to manually override (e.g. A-01).');
      return;
    }

    const slot = findSlotByCode(slotCode);
    if (!slot) {
      setError(`Slot "${slotCode}" not found.`);
      return;
    }

    setIsSubmitting(true);
    try {
      await apiFetch(`/slots/${slot.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });

      setSuccess(`🔧 Overrode Slot ${slotCode} status manually to: ${status}!`);
      
      setSlotCode('');
      setVehicleNo('');
      refetchSlots();
    } catch (err: any) {
      setError(err.message || 'Status override failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-bg-base flex transition-colors duration-300">
      {/* Collapsible Sidebar */}
      <Sidebar />

      {/* Main Content Area shifted left in desktop */}
      <div className="flex-1 md:pl-16 flex flex-col min-h-screen relative z-10">
        
        {/* Topbar HUD */}
        <TopBar />

        {/* Dash Grid */}
        <main className="flex-grow max-w-5xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 pb-24 lg:pb-12 no-print">
          
          {/* Left Column Input Access Card */}
          <div className="flex flex-col space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl border border-glass-border bg-bg-surface/60 backdrop-blur-md shadow-2xl flex flex-col justify-between">
              
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="space-y-1">
                    <div className="inline-flex items-center space-x-2 bg-accent/10 border border-accent/30 px-3 py-1.5 rounded-full">
                      <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-accent font-mono">
                        Gate Control Unit
                      </span>
                    </div>
                    <h2 className="text-xl font-black text-text-primary uppercase tracking-tight font-display">
                      Tactile Access Desk
                    </h2>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="p-2.5 rounded-xl border border-glass-border hover:border-glass-border-hover text-text-secondary hover:text-text-primary transition-all active:scale-95"
                    title="Print Slot Layout Grid"
                  >
                    <Printer className="w-4.5 h-4.5" />
                  </button>
                </div>

                {success && (
                  <div className="p-4 mb-4 rounded-2xl bg-available/10 border border-available/20 text-xs font-black text-available">
                    {success}
                  </div>
                )}

                <div className="space-y-6">
                  <SlotInput
                    value={slotCode}
                    onChange={setSlotCode}
                    vehicleNo={vehicleNo}
                    setVehicleNo={setVehicleNo}
                    error={error}
                  />

                  <ActionButtons
                    onEntry={handleEntry}
                    onExit={handleExit}
                    onOverrideStatus={handleOverrideStatus}
                    isSubmitting={isSubmitting}
                    disabled={slots.length === 0}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 text-[10px] text-text-secondary/70 italic mt-8 border-t border-glass-border/30 pt-4">
                <ShieldCheck className="w-3.5 h-3.5 text-available animate-pulse" />
                <span>AKTU college network security protocol active. Audits synced in real-time.</span>
              </div>

            </div>
          </div>

          {/* Right Column Shift Logs */}
          <div className="flex flex-col space-y-6">
            <RecentActions logs={recentLogs} />
          </div>

        </main>
      </div>

      {/* PRINT-ONLY MODE GRID VIEW */}
      <div className="hidden print:block p-8">
        <h1 className="text-xl font-bold mb-4 uppercase tracking-wider text-center border-b pb-2">
          ParkSense - AKTU Campus Parking Slot layout
        </h1>
        <div className="print-grid">
          {slots.map((s) => (
            <div key={s.id} className="p-2 border rounded font-mono text-center text-xs">
              <div className="font-bold">{s.slotCode}</div>
              <div className="text-[10px] mt-1">{s.status}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
