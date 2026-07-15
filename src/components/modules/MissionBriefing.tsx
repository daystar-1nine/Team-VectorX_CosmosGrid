import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ShieldAlert, Crosshair, Fingerprint, ChevronRight } from 'lucide-react';

export function MissionBriefing({ onProceed }: { onProceed: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1000),
      setTimeout(() => setPhase(2), 2500),
      setTimeout(() => setPhase(3), 4000),
      setTimeout(() => setPhase(4), 5500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 10, display: 'flex', alignItems: 'center', padding: '0 10vw' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '600px' }}>
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
          style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid var(--color-accent-primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0, 229, 255, 0.1)' }}>
            <Fingerprint size={24} color="var(--color-accent-primary)" />
          </div>
          <div>
            <h3 style={{ margin: 0, color: 'var(--color-text-primary)', letterSpacing: '0.1em' }}>COMMANDER K-9</h3>
            <span className="data-label">SECURITY CLEARANCE: LEVEL 9</span>
          </div>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: '2px solid rgba(255,255,255,0.1)', paddingLeft: '24px' }}>
          
          <AnimatePresence>
            {phase >= 1 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ padding: '16px', background: 'rgba(246, 195, 68, 0.05)', border: '1px solid rgba(246, 195, 68, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <ShieldAlert size={16} color="var(--color-status-warning)" />
                  <span className="data-label" style={{ color: 'var(--color-status-warning)' }}>THREAT LEVEL</span>
                </div>
                <h4 style={{ color: 'var(--color-text-primary)', margin: 0, letterSpacing: '0.05em' }}>OMEGA - GRAVITY GRID INSTABILITY</h4>
              </motion.div>
            )}

            {phase >= 2 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ padding: '16px', background: 'rgba(0, 229, 255, 0.05)', border: '1px solid rgba(0, 229, 255, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Crosshair size={16} color="var(--color-accent-primary)" />
                  <span className="data-label" style={{ color: 'var(--color-accent-primary)' }}>PRIMARY OBJECTIVE</span>
                </div>
                <p style={{ color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  Realign the outer sector warp gates and stabilize the energy core before structural collapse occurs. Failure will result in the loss of 40 billion lives across 12 sectors.
                </p>
              </motion.div>
            )}

            {phase >= 3 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <p className="data-value" style={{ color: 'var(--color-text-muted)' }}>
                  &gt; AI_MIND: "Commander, the grid is deteriorating 14% faster than predicted. You must act immediately."
                </p>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {phase >= 4 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <button 
              onClick={onProceed}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'var(--color-accent-primary)',
                color: '#000',
                border: 'none',
                padding: '16px 32px',
                fontFamily: 'var(--font-heading)',
                fontSize: '1rem',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                borderRadius: '4px',
                boxShadow: '0 0 20px rgba(0, 229, 255, 0.4)'
              }}
            >
              INITIALIZE COMMAND CENTER <ChevronRight size={18} />
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
