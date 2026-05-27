import { Router } from 'express';
import { register, login, logout, getMe, updateProfile } from '../controllers/auth';
import { getSlots, getSlotById, getZones, updateSlotStatus } from '../controllers/slots';
import { createReservation, cancelReservation, getMyReservation } from '../controllers/reservations';
import { createEntryLog, getEntryLogs, getLogsBySlot } from '../controllers/logs';
import { getHourlyOccupancy, getPeakHours, getDailyTrends, getZoneUtilization } from '../controllers/analytics';
import { authenticateToken, requireRole } from '../middleware/auth';
import { getSimulationStatus, toggleSimulation } from '../simulation/simulator';

const router = Router();

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/logout', logout);
router.get('/auth/me', authenticateToken, getMe);
router.patch('/auth/profile', authenticateToken, updateProfile);


// ==========================================
// SLOTS & ZONES ROUTES
// ==========================================
router.get('/slots', getSlots);
router.get('/slots/:id', getSlotById);
router.get('/zones', getZones);
router.patch(
  '/slots/:id/status',
  authenticateToken,
  requireRole(['GUARD', 'ADMIN']),
  updateSlotStatus
);

// ==========================================
// RESERVATIONS ROUTES
// ==========================================
router.post('/reservations', authenticateToken, createReservation);
router.delete('/reservations/:id', authenticateToken, cancelReservation);
router.get('/reservations/mine', authenticateToken, getMyReservation);

// ==========================================
// ENTRY/EXIT LOGS ROUTES
// ==========================================
router.post(
  '/logs',
  authenticateToken,
  requireRole(['GUARD', 'ADMIN']),
  createEntryLog
);
router.get(
  '/logs',
  authenticateToken,
  requireRole(['ADMIN']),
  getEntryLogs
);
router.get('/logs/slot/:id', authenticateToken, getLogsBySlot);

// ==========================================
// ANALYTICS ROUTES (ADMIN ONLY)
// ==========================================
router.get(
  '/analytics/occupancy',
  authenticateToken,
  requireRole(['ADMIN']),
  getHourlyOccupancy
);
router.get(
  '/analytics/peak',
  authenticateToken,
  requireRole(['ADMIN']),
  getPeakHours
);
router.get(
  '/analytics/trends',
  authenticateToken,
  requireRole(['ADMIN']),
  getDailyTrends
);
router.get(
  '/analytics/zones',
  authenticateToken,
  requireRole(['ADMIN']),
  getZoneUtilization
);

// ==========================================
// SIMULATION ROUTES (ADMIN ONLY)
// ==========================================
router.get('/admin/simulation', authenticateToken, requireRole(['ADMIN']), (req, res) => {
  return res.json({ enabled: getSimulationStatus() });
});

router.patch('/admin/simulation', authenticateToken, requireRole(['ADMIN']), (req, res) => {
  const { enabled } = req.body;
  if (enabled === undefined) {
    return res.status(400).json({ error: 'Field "enabled" is required.' });
  }
  const status = toggleSimulation(enabled);
  return res.json({ message: `Simulation ${status ? 'enabled' : 'disabled'}.`, enabled: status });
});

export default router;
