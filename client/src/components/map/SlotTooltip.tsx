'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlotData } from '../../store/slotStore';
import StatusBadge from '../ui/StatusBadge';
import { Shield, Sparkles, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface SlotTooltipProps {
  slot: SlotData | null;
  position: { x: number; y: number } | null;
  onReserve: (slot: SlotData) => void;
  onClose: () => void;
}

export default function SlotTooltip({ slot, position, onReserve, onClose }: SlotTooltipProps) {
  if (!slot || !position) return null;

  const handleReserveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onReserve(slot);
    onClose();
  };

  const isReservable = slot.status === 'AVAILABLE' && !slot.isDisabled;

  // Derive target group representation
  const isFacultyOnly = slot.zone.allowedRoles.includes('FACULTY') && !slot.zone.allowedRoles.includes('STUDENT');
  const allowedText = slot.zone.allowedRoles.map(r => r.charAt(0) + r.slice(1).toLowerCase()).join(' & ');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 8 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed',
          top: position.y - 180, // slightly more offset to fit new content
          left: position.x - 104, // centered on cursor (half of width w-52 = 208px)
          zIndex: 9999,
        }}
        className="w-52 p-4 rounded-2xl border border-glass-border bg-bg-surface/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_15px_rgba(79,142,247,0.1)] pointer-events-auto"
        onMouseLeave={onClose}
      >
        {/* Glow accent beam on top */}
        <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-80" />

        <div className="flex flex-col space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <span className="font-mono text-xs font-black tracking-widest text-[#F0F2FF] bg-[#1E293B] px-2 py-0.5 rounded border border-gray-700">
                {slot.slotCode}
              </span>
            </div>
            <button 
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary text-[11px] p-1 hover:bg-white/5 rounded-full transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Zone & Access Level */}
          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold tracking-widest text-text-secondary">
              {slot.zone.name.split(' - ')[0]}
            </div>
            <div className="flex items-center text-[10px] text-text-secondary font-medium">
              <Shield className="w-3 h-3 text-accent mr-1 flex-shrink-0" />
              <span>Access: <strong className="text-text-primary">{allowedText}</strong></span>
            </div>
          </div>

          <hr className="border-glass-border" />

          {/* Status Badge & details */}
          <div className="flex flex-col space-y-2">
            <div className="flex justify-start">
              <StatusBadge status={slot.status} />
            </div>

            {slot.status === 'AVAILABLE' && (
              <div className="flex items-center text-[10px] text-available font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                <span>Ready for parking</span>
              </div>
            )}

            {slot.status === 'OCCUPIED' && (
              <div className="flex items-center text-[10px] text-occupied font-semibold">
                <Clock className="w-3.5 h-3.5 mr-1" />
                <span>Occupied Live</span>
              </div>
            )}

            {slot.status === 'RESERVED' && (
              <div className="flex items-center text-[10px] text-reserved font-semibold">
                <Clock className="w-3.5 h-3.5 mr-1 animate-pulse" />
                <span>15m Active Hold</span>
              </div>
            )}
          </div>

          {/* Booking Action */}
          {isReservable ? (
            <button
              onClick={handleReserveClick}
              className="w-full mt-1 py-2 px-3 rounded-xl bg-accent text-[#F0F2FF] text-xs font-black tracking-wider uppercase shadow-md hover:bg-opacity-90 hover:shadow-[0_0_15px_var(--accent-glow)] transition-all active:scale-[0.97]"
            >
              Reserve Slot
            </button>
          ) : (
            <div className="w-full mt-1 py-1.5 px-3 rounded-xl bg-disabled/15 border border-disabled/20 text-center text-[9px] text-text-secondary italic">
              {slot.isDisabled ? (
                <span className="flex items-center justify-center text-occupied/80">
                  <AlertTriangle className="w-3 h-3 mr-1" /> Maintenance Active
                </span>
              ) : (
                'Temporarily Reserved'
              )}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
