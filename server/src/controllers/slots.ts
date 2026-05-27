import { Request, Response } from 'express';
import prisma from '../services/db';
import { getCache, setCache, invalidateCache } from '../services/redis';
import { emitSlotUpdate } from '../services/socket';

export const getSlots = async (req: Request, res: Response) => {
  try {
    const cacheKey = 'parksense:slots';
    const cachedSlots = await getCache(cacheKey);

    if (cachedSlots) {
      return res.json(JSON.parse(cachedSlots));
    }

    const slots = await prisma.slot.findMany({
      include: {
        zone: {
          select: {
            name: true,
            allowedRoles: true,
          },
        },
      },
      orderBy: {
        slotCode: 'asc',
      },
    });

    // Parse allowedRoles from comma-separated string to array
    const formattedSlots = slots.map((slot) => ({
      ...slot,
      zone: {
        ...slot.zone,
        allowedRoles: slot.zone.allowedRoles.split(','),
      },
    }));

    await setCache(cacheKey, JSON.stringify(formattedSlots), 5); // 5s TTL
    return res.json(formattedSlots);
  } catch (error: any) {
    console.error('getSlots error:', error);
    return res.status(500).json({ error: 'Internal server error while fetching slots.' });
  }
};

export const getSlotById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const slot = await prisma.slot.findUnique({
      where: { id },
      include: {
        zone: true,
        reservations: {
          where: { status: 'ACTIVE' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                vehicleNo: true,
              },
            },
          },
        },
      },
    });

    if (!slot) {
      return res.status(404).json({ error: 'Slot not found.' });
    }

    // Format allowedRoles as array
    const formattedSlot = {
      ...slot,
      zone: {
        ...slot.zone,
        allowedRoles: slot.zone.allowedRoles.split(','),
      },
    };

    return res.json(formattedSlot);
  } catch (error: any) {
    console.error('getSlotById error:', error);
    return res.status(500).json({ error: 'Internal server error while fetching slot details.' });
  }
};

export const getZones = async (req: Request, res: Response) => {
  try {
    const cacheKey = 'parksense:zones';
    const cachedZones = await getCache(cacheKey);

    if (cachedZones) {
      return res.json(JSON.parse(cachedZones));
    }

    const zones = await prisma.zone.findMany({
      include: {
        slots: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    const formattedZones = zones.map((zone) => {
      const slots = zone.slots;
      const total = zone.totalSlots;
      const available = slots.filter((s) => s.status === 'AVAILABLE').length;
      const occupied = slots.filter((s) => s.status === 'OCCUPIED').length;
      const reserved = slots.filter((s) => s.status === 'RESERVED').length;
      const disabled = slots.filter((s) => s.status === 'DISABLED' || s.isDisabled).length;

      return {
        id: zone.id,
        name: zone.name,
        totalSlots: total,
        allowedRoles: zone.allowedRoles.split(','),
        available,
        occupied,
        reserved,
        disabled,
      };
    });

    await setCache(cacheKey, JSON.stringify(formattedZones), 5); // 5s TTL
    return res.json(formattedZones);
  } catch (error: any) {
    console.error('getZones error:', error);
    return res.status(500).json({ error: 'Internal server error while fetching zones.' });
  }
};

export const updateSlotStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, isDisabled } = req.body;

    if (!status && isDisabled === undefined) {
      return res.status(400).json({ error: 'Status or isDisabled is required.' });
    }

    // Verify valid status
    const validStatuses = ['AVAILABLE', 'OCCUPIED', 'RESERVED', 'DISABLED'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid slot status value.' });
    }

    const slot = await prisma.slot.findUnique({ where: { id } });
    if (!slot) {
      return res.status(404).json({ error: 'Slot not found.' });
    }

    // Prepare update data
    const updateData: any = {};
    if (status) updateData.status = status;
    if (isDisabled !== undefined) updateData.isDisabled = isDisabled;

    const updatedSlot = await prisma.slot.update({
      where: { id },
      data: updateData,
    });

    // Invalidate caches
    await invalidateCache('parksense:slots');
    await invalidateCache('parksense:zones');

    // Emit live Socket.io updates
    if (status) {
      await emitSlotUpdate(id, status);
    }

    return res.json({
      message: 'Slot updated successfully',
      slot: updatedSlot,
    });
  } catch (error: any) {
    console.error('updateSlotStatus error:', error);
    return res.status(500).json({ error: 'Internal server error while updating slot status.' });
  }
};
