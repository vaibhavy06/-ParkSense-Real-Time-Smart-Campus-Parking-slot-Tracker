import { Response } from 'express';
import prisma from '../services/db';
import { AuthenticatedRequest } from '../middleware/auth';
import { invalidateCache } from '../services/redis';
import { emitSlotUpdate } from '../services/socket';

export const createReservation = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { slotId } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    if (!slotId) {
      return res.status(400).json({ error: 'Slot ID is required.' });
    }

    // 1. Check if user already has an active reservation
    const activeReservation = await prisma.reservation.findFirst({
      where: {
        userId: user.id,
        status: 'ACTIVE',
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (activeReservation) {
      return res.status(400).json({ error: 'You already have an active slot reservation.' });
    }

    // 2. Fetch the slot and its zone details
    const slot = await prisma.slot.findUnique({
      where: { id: slotId },
      include: { zone: true },
    });

    if (!slot) {
      return res.status(404).json({ error: 'Slot not found.' });
    }

    if (slot.status !== 'AVAILABLE' || slot.isDisabled) {
      return res.status(400).json({ error: 'Slot is not available for reservation.' });
    }

    const zone = slot.zone;

    // 3. Apply role restrictions:
    // - Students cannot reserve Faculty Zone
    // - Faculty can only reserve Faculty Zone slots
    const isFacultyZone = zone.name.toLowerCase().includes('faculty');

    if (user.role === 'STUDENT' && isFacultyZone) {
      return res.status(403).json({ error: 'Students are not allowed to reserve slots in the Faculty Zone.' });
    }

    if (user.role === 'FACULTY' && !isFacultyZone) {
      return res.status(403).json({ error: 'Faculty members can only reserve slots in the Faculty Zone.' });
    }

    // Double check: is user's role allowed in this zone?
    if (!zone.allowedRoles.split(',').includes(user.role)) {
      return res.status(403).json({ error: 'Your role is not allowed in this zone.' });
    }

    // 4. Create reservation with 15 minutes hold
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    // Run in a Prisma transaction to avoid race conditions
    const reservation = await prisma.$transaction(async (tx) => {
      // Re-verify slot availability inside transaction
      const currentSlot = await tx.slot.findUnique({
        where: { id: slotId },
      });

      if (!currentSlot || currentSlot.status !== 'AVAILABLE') {
        throw new Error('Slot was reserved or occupied by someone else just now!');
      }

      // Update slot status
      await tx.slot.update({
        where: { id: slotId },
        data: { status: 'RESERVED' },
      });

      // Create reservation hold
      return tx.reservation.create({
        data: {
          userId: user.id,
          slotId,
          expiresAt,
          status: 'ACTIVE',
        },
        include: {
          slot: {
            include: {
              zone: true,
            },
          },
        },
      });
    });

    // Format allowedRoles as array for the API response
    const formattedReservation = {
      ...reservation,
      slot: {
        ...reservation.slot,
        zone: {
          ...reservation.slot.zone,
          allowedRoles: reservation.slot.zone.allowedRoles.split(','),
        },
      },
    };

    // Invalidate caches
    await invalidateCache('parksense:slots');
    await invalidateCache('parksense:zones');

    // Emit Socket.io update
    await emitSlotUpdate(slotId, 'RESERVED');

    return res.status(201).json({
      message: 'Slot reserved successfully for 15 minutes.',
      reservation: formattedReservation,
    });
  } catch (error: any) {
    console.error('createReservation error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error while reserving slot.' });
  }
};

export const cancelReservation = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: { slot: true },
    });

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found.' });
    }

    // Only owner or guard/admin can cancel
    if (reservation.userId !== user.id && user.role !== 'ADMIN' && user.role !== 'GUARD') {
      return res.status(403).json({ error: 'You are not authorized to cancel this reservation.' });
    }

    if (reservation.status !== 'ACTIVE') {
      return res.status(400).json({ error: 'Reservation is not active.' });
    }

    // Cancel reservation inside a transaction
    await prisma.$transaction(async (tx) => {
      await tx.reservation.update({
        where: { id },
        data: { status: 'CANCELLED' },
      });

      // Reset slot to AVAILABLE only if it's currently RESERVED
      if (reservation.slot.status === 'RESERVED') {
        await tx.slot.update({
          where: { id: reservation.slotId },
          data: { status: 'AVAILABLE' },
        });
      }
    });

    // Invalidate caches
    await invalidateCache('parksense:slots');
    await invalidateCache('parksense:zones');

    // Emit Socket.io update
    await emitSlotUpdate(reservation.slotId, 'AVAILABLE');

    return res.json({ message: 'Reservation cancelled successfully.' });
  } catch (error: any) {
    console.error('cancelReservation error:', error);
    return res.status(500).json({ error: 'Internal server error while cancelling reservation.' });
  }
};

export const getMyReservation = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const reservation = await prisma.reservation.findFirst({
      where: {
        userId: user.id,
        status: 'ACTIVE',
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        slot: {
          include: {
            zone: true,
          },
        },
      },
    });

    if (!reservation) {
      return res.json(null);
    }

    // Format allowedRoles as array
    const formattedReservation = {
      ...reservation,
      slot: {
        ...reservation.slot,
        zone: {
          ...reservation.slot.zone,
          allowedRoles: reservation.slot.zone.allowedRoles.split(','),
        },
      },
    };

    return res.json(formattedReservation);
  } catch (error: any) {
    console.error('getMyReservation error:', error);
    return res.status(500).json({ error: 'Internal server error while fetching reservation.' });
  }
};
