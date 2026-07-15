import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { useAppStore } from '../../store';

export function GlobalAlerts() {
  const { alertActive, alertMessage } = useAppStore();

  return (
    <div style={{ position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)', zIndex: 100, pointerEvents: 'none' }}>
      <AnimatePresence>
        {alertActive && alertMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            style={{
              background: 'rgba(255, 0, 50, 0.15)',
              backdropFilter: 'blur(12px)',
              border: '1px solid var(--color-status-danger)',
              padding: '16px 32px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              boxShadow: '0 0 30px rgba(255, 0, 50, 0.2)'
            }}
          >
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <AlertTriangle color="var(--color-status-danger)" size={24} />
            </motion.div>
            <span style={{ color: 'var(--color-status-danger)', fontFamily: 'var(--font-heading)', fontSize: '1.2rem', letterSpacing: '0.1em' }}>
              {alertMessage}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
