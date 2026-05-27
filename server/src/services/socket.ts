import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import prisma from './db';

let io: SocketIOServer | null = null;

export const initSocket = (httpServer: HTTPServer): SocketIOServer => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*', // In production, restrict this to allowed origins
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`Socket client connected: ${socket.id}`);

    // Join campus-wide updates
    socket.on('join:campus', () => {
      socket.join('campus');
      console.log(`Client ${socket.id} joined room: campus`);
    });

    // Join zone-specific updates
    socket.on('join:zone', ({ zoneId }) => {
      socket.join(`zone:${zoneId}`);
      console.log(`Client ${socket.id} joined room: zone:${zoneId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Socket client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIo = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.io has not been initialized. Call initSocket first.');
  }
  return io;
};

// Broadcast slot update to all listeners
export const emitSlotUpdate = async (slotId: string, status: string) => {
  try {
    if (!io) return;
    
    // Broadcast to campus wide
    io.to('campus').emit('slot:update', { slotId, status });
    console.log(`[Socket] Broadcast slot:update -> Slot: ${slotId}, Status: ${status}`);

    // Also update zone stats and broadcast zone update
    const slot = await prisma.slot.findUnique({
      where: { id: slotId },
      include: { zone: true },
    });

    if (slot) {
      await emitZoneUpdate(slot.zoneId);
    }
  } catch (err) {
    console.error('Error emitting slot update:', err);
  }
};

// Calculate and broadcast zone updates
export const emitZoneUpdate = async (zoneId: string) => {
  try {
    if (!io) return;

    const zone = await prisma.zone.findUnique({
      where: { id: zoneId },
      include: { slots: true },
    });

    if (!zone) return;

    const available = zone.slots.filter((s) => s.status === 'AVAILABLE').length;
    const occupied = zone.slots.filter((s) => s.status === 'OCCUPIED').length;
    const reserved = zone.slots.filter((s) => s.status === 'RESERVED').length;
    const disabled = zone.slots.filter((s) => s.status === 'DISABLED' || s.isDisabled).length;

    const payload = {
      zoneId,
      available,
      occupied,
      reserved,
      disabled,
      totalSlots: zone.totalSlots,
    };

    // Broadcast to campus and specific zone room
    io.to('campus').emit('zone:update', payload);
    io.to(`zone:${zoneId}`).emit('zone:update', payload);
    
    console.log(`[Socket] Broadcast zone:update -> Zone: ${zone.name}, Avail: ${available}, Occ: ${occupied}, Res: ${reserved}`);
  } catch (err) {
    console.error('Error emitting zone update:', err);
  }
};
