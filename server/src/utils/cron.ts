import cron from 'node-cron';
import prisma from '../services/db';
import { invalidateCache } from '../services/redis';
import { emitSlotUpdate, getIo } from '../services/socket';

export const initCronJobs = () => {
  console.log('Initializing background cron jobs...');

  // Auto-release expired reservations every 60 seconds
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();

      // Find all active reservations that have expired
      const expiredReservations = await prisma.reservation.findMany({
        where: {
          status: 'ACTIVE',
          expiresAt: {
            lt: now,
          },
        },
        include: {
          slot: true,
        },
      });

      if (expiredReservations.length === 0) return;

      console.log(`[Cron] Found ${expiredReservations.length} expired reservations to release.`);

      for (const res of expiredReservations) {
        // Run in transaction to release slot securely
        await prisma.$transaction(async (tx) => {
          await tx.reservation.update({
            where: { id: res.id },
            data: { status: 'EXPIRED' },
          });

          // Reset slot status to AVAILABLE if it is still marked as RESERVED
          if (res.slot.status === 'RESERVED') {
            await tx.slot.update({
              where: { id: res.slotId },
              data: { status: 'AVAILABLE' },
            });
          }
        });

        // Invalidate Redis caches
        await invalidateCache('parksense:slots');
        await invalidateCache('parksense:zones');

        // Broadcast Socket.io events
        await emitSlotUpdate(res.slotId, 'AVAILABLE');

        // Notify client about reservation expiration
        try {
          const io = getIo();
          io.to('campus').emit('reservation:expired', {
            reservationId: res.id,
            slotId: res.slotId,
          });
        } catch (sErr) {
          // Socket might not be fully ready in some contexts
        }

        console.log(`[Cron] Released slot ${res.slot.slotCode} for expired reservation ${res.id}`);
      }
    } catch (error) {
      console.error('[Cron] Error running reservation auto-release job:', error);
    }
  });
};
