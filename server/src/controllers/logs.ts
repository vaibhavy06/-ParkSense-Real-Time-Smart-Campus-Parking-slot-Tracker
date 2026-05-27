import { Response } from 'express';
import prisma from '../services/db';
import { AuthenticatedRequest } from '../middleware/auth';
import { invalidateCache } from '../services/redis';
import { emitSlotUpdate } from '../services/socket';

export const createEntryLog = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { slotId, vehicleNo, action } = req.body;

    if (!slotId || !action) {
      return res.status(400).json({ error: 'Slot ID and action (ENTRY/EXIT) are required.' });
    }

    const validActions = ['ENTRY', 'EXIT'];
    if (!validActions.includes(action)) {
      return res.status(400).json({ error: 'Invalid action. Must be ENTRY or EXIT.' });
    }

    const slot = await prisma.slot.findUnique({
      where: { id: slotId },
    });

    if (!slot) {
      return res.status(404).json({ error: 'Slot not found.' });
    }

    let finalUserId: string | null = null;
    let finalVehicleNo = vehicleNo || null;

    if (action === 'ENTRY') {
      // 1. Check if slot has an active reservation
      const activeRes = await prisma.reservation.findFirst({
        where: {
          slotId,
          status: 'ACTIVE',
          expiresAt: {
            gt: new Date(),
          },
        },
        include: { user: true },
      });

      if (activeRes) {
        // Fulfill active reservation
        await prisma.reservation.update({
          where: { id: activeRes.id },
          data: { status: 'FULFILLED' },
        });
        
        finalUserId = activeRes.userId;
        if (!finalVehicleNo) {
          finalVehicleNo = activeRes.user.vehicleNo;
        }
      } else {
        // Try to match vehicle number to an existing user if provided
        if (finalVehicleNo) {
          const user = await prisma.user.findFirst({
            where: { vehicleNo: finalVehicleNo },
          });
          if (user) finalUserId = user.id;
        }
      }

      // Update slot status to OCCUPIED
      await prisma.slot.update({
        where: { id: slotId },
        data: { status: 'OCCUPIED' },
      });

      // Create Entry Log
      const log = await prisma.entryLog.create({
        data: {
          slotId,
          userId: finalUserId,
          vehicleNo: finalVehicleNo,
          action: 'ENTRY',
        },
        include: {
          slot: true,
          user: {
            select: { name: true, email: true },
          },
        },
      });

      await invalidateCache('parksense:slots');
      await invalidateCache('parksense:zones');
      await emitSlotUpdate(slotId, 'OCCUPIED');

      return res.status(201).json({ message: 'Entry logged successfully.', log });

    } else {
      // Action: EXIT
      // Find the last ENTRY log for this slot to auto-link the user and vehicle number
      const lastEntry = await prisma.entryLog.findFirst({
        where: {
          slotId,
          action: 'ENTRY',
        },
        orderBy: {
          timestamp: 'desc',
        },
      });

      if (lastEntry) {
        finalUserId = lastEntry.userId;
        if (!finalVehicleNo) finalVehicleNo = lastEntry.vehicleNo;
      }

      // Update slot status to AVAILABLE
      await prisma.slot.update({
        where: { id: slotId },
        data: { status: 'AVAILABLE' },
      });

      // Create Exit Log
      const log = await prisma.entryLog.create({
        data: {
          slotId,
          userId: finalUserId,
          vehicleNo: finalVehicleNo,
          action: 'EXIT',
        },
        include: {
          slot: true,
          user: {
            select: { name: true, email: true },
          },
        },
      });

      await invalidateCache('parksense:slots');
      await invalidateCache('parksense:zones');
      await emitSlotUpdate(slotId, 'AVAILABLE');

      return res.status(201).json({ message: 'Exit logged successfully.', log });
    }
  } catch (error: any) {
    console.error('createEntryLog error:', error);
    return res.status(500).json({ error: 'Internal server error while logging entry/exit.' });
  }
};

export const getEntryLogs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [logs, total] = await prisma.$transaction([
      prisma.entryLog.findMany({
        skip,
        take: limit,
        orderBy: {
          timestamp: 'desc',
        },
        include: {
          slot: {
            include: {
              zone: {
                select: { name: true, allowedRoles: true },
              },
            },
          },
          user: {
            select: {
              name: true,
              email: true,
              role: true,
            },
          },
        },
      }),
      prisma.entryLog.count(),
    ]);

    // Format logs so that allowedRoles is parsed back into an array
    const formattedLogs = logs.map((log) => {
      const zone = log.slot.zone;
      return {
        ...log,
        slot: {
          ...log.slot,
          zone: {
            ...zone,
            allowedRoles: zone.allowedRoles.split(','),
          },
        },
      };
    });

    return res.json({
      logs: formattedLogs,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    });
  } catch (error: any) {
    console.error('getEntryLogs error:', error);
    return res.status(500).json({ error: 'Internal server error while fetching logs.' });
  }
};

export const getLogsBySlot = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const logs = await prisma.entryLog.findMany({
      where: { slotId: id },
      orderBy: {
        timestamp: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return res.json(logs);
  } catch (error: any) {
    console.error('getLogsBySlot error:', error);
    return res.status(500).json({ error: 'Internal server error while fetching slot logs.' });
  }
};
