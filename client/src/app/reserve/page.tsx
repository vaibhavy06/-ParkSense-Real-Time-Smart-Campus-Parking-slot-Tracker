'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSlots } from '../../hooks/useSlots';
import { useReservation } from '../../hooks/useReservation';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/TopBar';
import StepperNav from '../../components/ui/StepperNav';
import ZonePicker from '../../components/reservation/ZonePicker';
import SlotPicker from '../../components/reservation/SlotPicker';
import ConfirmStep from '../../components/reservation/ConfirmStep';
import SuccessScreen from '../../components/reservation/SuccessScreen';
import { SlotData, ZoneData } from '../../store/slotStore';
import { Sparkles } from 'lucide-react';

function ReserveSlotWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slotIdParam = searchParams.get('slotId');

  const { slots, zones, isLoading: isSlotsLoading } = useSlots();
  const { activeReservation, reserveSlot, isReserving, reserveError } = useReservation();
  const { isAuthenticated } = useAuth();

  // Wizard Step State
  // 1: Pick Zone, 2: Pick Slot, 3: Confirm, 4: Success
  const [step, setStep] = useState(1);
  const [selectedZone, setSelectedZone] = useState<ZoneData | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<SlotData | null>(null);

  // Auth guard
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Handle direct slot parameter landing (e.g. redirect from Live Map hover tooltip)
  useEffect(() => {
    if (slotIdParam && slots.length > 0) {
      const slot = slots.find((s) => s.id === slotIdParam);
      if (slot) {
        setSelectedSlot(slot);
        const zone = zones.find((z) => z.id === slot.zoneId);
        if (zone) setSelectedZone(zone);
        setStep(3); // Jump directly to Confirm!
      }
    }
  }, [slotIdParam, slots, zones]);

  // Jump to step 4 if they already have an active reservation (and we are not on step 4 yet)
  useEffect(() => {
    if (activeReservation && step !== 4 && !slotIdParam) {
      setStep(4);
    }
  }, [activeReservation, step, slotIdParam]);

  const handleZoneSelect = (zone: ZoneData) => {
    setSelectedZone(zone);
    setStep(2);
  };

  const handleSlotSelect = (slot: SlotData) => {
    setSelectedSlot(slot);
    setStep(3);
  };

  const handleConfirm = async (vehicleNo: string) => {
    if (!selectedSlot) return;
    try {
      await reserveSlot(selectedSlot.id);
      setStep(4);
    } catch (err) {
      // Handled by the useReservation hook
    }
  };

  if (isSlotsLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-bg-base">
        <div className="w-10 h-10 rounded-full border-4 border-accent border-t-transparent animate-spin" />
        <span className="text-xs font-bold uppercase tracking-widest text-text-secondary mt-4">
          Loading Booking Engines...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base flex transition-colors duration-300">
      {/* Collapsible Sidebar */}
      <Sidebar />

      {/* Main Content Layout container shifted right in desktop */}
      <div className="flex-1 md:pl-16 flex flex-col min-h-screen relative z-10">
        
        {/* Topbar HUD */}
        <TopBar />

        {/* Wizard Panel Area */}
        <main className="flex-grow max-w-4xl w-full mx-auto p-4 md:p-6 pb-24 md:pb-12">
          
          <div className="w-full p-6 md:p-10 rounded-3xl border border-glass-border bg-bg-surface/60 backdrop-blur-md shadow-2xl">
            {/* Step Progress indicators (only for steps 1-3) */}
            {step < 4 && (
              <div className="mb-8 border-b border-glass-border/30 pb-4">
                <StepperNav currentStep={step} />
              </div>
            )}

            {/* Step Renders */}
            {step === 1 && (
              <ZonePicker
                zones={zones}
                onSelect={handleZoneSelect}
              />
            )}

            {step === 2 && selectedZone && (
              <SlotPicker
                zone={selectedZone}
                slots={slots}
                onSelect={handleSlotSelect}
                onBack={() => setStep(1)}
              />
            )}

            {step === 3 && selectedSlot && (
              <ConfirmStep
                slot={selectedSlot}
                onConfirm={handleConfirm}
                onBack={() => {
                  if (slotIdParam) router.push('/map');
                  else setStep(2);
                }}
                isSubmitting={isReserving}
                error={reserveError}
              />
            )}

            {step === 4 && activeReservation && (
              <SuccessScreen reservation={activeReservation} />
            )}
          </div>

        </main>
      </div>
    </div>
  );
}

export default function ReserveSlotPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-bg-base">
        <div className="w-10 h-10 rounded-full border-4 border-accent border-t-transparent animate-spin" />
        <span className="text-xs font-bold uppercase tracking-widest text-text-secondary mt-4">
          Securing Reservation System...
        </span>
      </div>
    }>
      <ReserveSlotWizard />
    </Suspense>
  );
}

