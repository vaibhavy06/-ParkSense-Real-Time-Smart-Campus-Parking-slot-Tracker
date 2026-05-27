'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, isVisible, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const styles = {
    success: {
      border: 'border-available/30',
      icon: <CheckCircle2 className="w-5 h-5 text-available animate-pulse" />,
      bg: 'bg-available/10',
      glow: 'shadow-[0_0_15px_rgba(0,230,118,0.15)]',
    },
    error: {
      border: 'border-occupied/30',
      icon: <AlertTriangle className="w-5 h-5 text-occupied animate-pulse" />,
      bg: 'bg-occupied/10',
      glow: 'shadow-[0_0_15px_rgba(255,75,75,0.15)]',
    },
    info: {
      border: 'border-accent/30',
      icon: <Info className="w-5 h-5 text-accent animate-pulse" />,
      bg: 'bg-accent/10',
      glow: 'shadow-[0_0_15px_rgba(79,142,247,0.15)]',
    },
  };

  const current = styles[type] || styles.info;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className={`fixed top-6 right-6 z-50 flex items-center space-x-3 p-4 rounded-2xl glass border ${current.border} ${current.glow} max-w-sm pointer-events-auto`}
        >
          <div className={`p-2 rounded-xl ${current.bg}`}>
            {current.icon}
          </div>
          
          <div className="flex-1 pr-2">
            <p className="text-xs font-bold text-text-primary tracking-wide leading-relaxed font-body">
              {message}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
