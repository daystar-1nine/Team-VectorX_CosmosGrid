import { motion, AnimatePresence } from 'framer-motion';
import { List } from 'lucide-react';
import { useAppStore } from '../../store';

export function MissionFeed() {
  const { missionLogs } = useAppStore();

  return (
    <div className="glass-panel panel widget" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <List size={14} color="var(--color-accent-primary)" />
          <span style={{ color: 'var(--color-accent-primary)' }}>MISSION FEED</span>
        </div>
      </div>
      
      <div className="panel-content" style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflow: 'hidden' }}>
        <AnimatePresence>
          {missionLogs.map((log) => {
            const isCritical = log.status === 'critical';
            const isPending = log.status === 'pending';
            
            return (
              <motion.div 
                key={log.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '4px',
                  borderLeft: `2px solid ${isCritical ? 'var(--color-status-danger)' : (isPending ? 'var(--color-status-warning)' : 'var(--color-accent-primary)')}`,
                  paddingLeft: '12px',
                  background: isCritical ? 'rgba(255, 0, 50, 0.05)' : 'transparent',
                  padding: '4px 0 4px 12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                  <span style={{ color: 'var(--color-accent-primary)' }}>{log.id}</span>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{log.time}</span>
                </div>
                <span style={{ 
                  fontSize: '0.8rem', 
                  color: isCritical ? '#fff' : 'var(--color-text-primary)',
                  fontFamily: 'var(--font-heading)',
                  letterSpacing: '0.05em',
                  textShadow: isCritical ? '0 0 5px rgba(255,0,50,0.5)' : 'none'
                }}>
                  {log.desc}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
