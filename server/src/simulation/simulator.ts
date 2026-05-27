import prisma from '../services/db';
import { invalidateCache } from '../services/redis';
import { emitSlotUpdate } from '../services/socket';

let isSimulationEnabled = true;
let simulationInterval: NodeJS.Timeout | null = null;

const dummyVehicles = [
  'UP32KK4321', 'UP16ZZ0077', 'DL3CAB1122', 'HR26PP9988', 
  'UP32YT5432', 'MH02AX8899', 'UP80EE4455', 'UP32MM1111'
];

export const getSimulationStatus = () => isSimulationEnabled;

export const toggleSimulation = (enabled: boolean) => {
  isSimulationEnabled = enabled;
  console.log(`[Simulator] Simulation has been ${enabled ? 'ENABLED' : 'DISABLED'}.`);
  return isSimulationEnabled;
};

// Main simulation routine
const runSimulationStep = async () => {
  if (!isSimulationEnabled) return;

  try {
    const now = new Date();
    const hour = now.getHours();

    // Determine if we are in peak campus hours
    const isPeakHour = 
      (hour >= 8 && hour < 10) ||   // 8:00 AM - 10:00 AM (Morning arrivals)
      (hour >= 12 && hour < 14) ||  // 12:00 PM - 2:00 PM (Lunch break dip/change)
      (hour >= 16 && hour < 18);    // 4:00 PM - 6:00 PM (Evening departures/shifts)

    // Set rates: peak hour means more entries, less exits. Off-peak means steady exits.
    const slotsToOccupyCount = isPeakHour 
      ? Math.floor(Math.random() * 3) + 2 // 2 to 4 entries
      : Math.floor(Math.random() * 2) + 1; // 1 to 2 entries

    const slotsToFreeCount = isPeakHour
      ? Math.floor(Math.random() * 2) + 1  // 1 to 2 exits
      : Math.floor(Math.random() * 2) + 2; // 2 to 3 exits

    console.log(`[Simulator] Step - Peak: ${isPeakHour}, Occupying: ${slotsToOccupyCount}, Freeing: ${slotsToFreeCount}`);

    // --- 1. SIMULATE CARS ARRIVING (AVAILABLE -> OCCUPIED) ---
    const availableSlots = await prisma.slot.findMany({
      where: { status: 'AVAILABLE', isDisabled: false, slotCode: { not: 'A-01' } }, // Keep A-01 open for easy demo
    });

    if (availableSlots.length > 5) {
      // Pick random available slots
      const shuffled = availableSlots.sort(() => 0.5 - Math.random());
      const selectedToOccupy = shuffled.slice(0, slotsToOccupyCount);

      for (const slot of selectedToOccupy) {
        const vehicleNo = dummyVehicles[Math.floor(Math.random() * dummyVehicles.length)];
        
        await prisma.$transaction(async (tx) => {
          await tx.slot.update({
            where: { id: slot.id },
            data: { status: 'OCCUPIED' },
          });

          await tx.entryLog.create({
            data: {
              slotId: slot.id,
              vehicleNo,
              action: 'ENTRY',
            },
          });
        });

        // Invalidate Redis caches
        await invalidateCache('parksense:slots');
        await invalidateCache('parksense:zones');

        // Broadcast live Socket.io event
        await emitSlotUpdate(slot.id, 'OCCUPIED');
        console.log(`[Simulator] Slot ${slot.slotCode} occupied by vehicle ${vehicleNo}`);
      }
    }

    // --- 2. SIMULATE CARS DEPARTING (OCCUPIED -> AVAILABLE) ---
    const occupiedSlots = await prisma.slot.findMany({
      where: { status: 'OCCUPIED' },
    });

    if (occupiedSlots.length > 5) {
      // Pick random occupied slots
      const shuffled = occupiedSlots.sort(() => 0.5 - Math.random());
      const selectedToFree = shuffled.slice(0, slotsToFreeCount);

      for (const slot of selectedToFree) {
        // Trace vehicle from last entry log if possible
        const lastEntry = await prisma.entryLog.findFirst({
          where: { slotId: slot.id, action: 'ENTRY' },
          orderBy: { timestamp: 'desc' },
        });

        const vehicleNo = lastEntry?.vehicleNo || 'UP32XX0000';

        await prisma.$transaction(async (tx) => {
          await tx.slot.update({
            where: { id: slot.id },
            data: { status: 'AVAILABLE' },
          });

          await tx.entryLog.create({
            data: {
              slotId: slot.id,
              vehicleNo,
              action: 'EXIT',
            },
          });
        });

        // Invalidate Redis caches
        await invalidateCache('parksense:slots');
        await invalidateCache('parksense:zones');

        // Broadcast live Socket.io event
        await emitSlotUpdate(slot.id, 'AVAILABLE');
        console.log(`[Simulator] Slot ${slot.slotCode} vacated by vehicle ${vehicleNo}`);
      }
    }
  } catch (error) {
    console.error('[Simulator] Error in simulation step:', error);
  }
};

export const startSimulation = () => {
  if (simulationInterval) return;
  console.log('[Simulator] Starting real-time parking simulation...');
  simulationInterval = setInterval(runSimulationStep, 30000); // every 30s
};

export const stopSimulation = () => {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
    console.log('[Simulator] Stopped real-time parking simulation.');
  }
};
