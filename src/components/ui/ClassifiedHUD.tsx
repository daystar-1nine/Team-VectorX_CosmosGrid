import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function ClassifiedHUD() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}>
      
      {/* 15-Second Scan Line Effect */}
      <motion.div
        animate={{ y: ['-10%', '110%'], opacity: [0, 0.5, 0] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 12, ease: "linear" }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.8), transparent)',
          boxShadow: '0 0 20px rgba(0, 229, 255, 0.5)'
        }}
      />

      {/* Top Right Status (Minimal) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 5 }}
        style={{ position: 'absolute', top: '40px', right: '40px', textAlign: 'right', opacity: 0.4 }}
      >
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-text-secondary)', letterSpacing: '0.1em', marginBottom: '8px' }}>
          UNIVERSAL TIME <span style={{ color: 'var(--color-accent-primary)', marginLeft: '8px' }}>{time}</span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-text-secondary)', letterSpacing: '0.1em' }}>
          GRID STATUS <span style={{ color: 'var(--color-status-success)', marginLeft: '8px' }}>ONLINE</span>
        </div>
      </motion.div>

      {/* Environmental Projections (Bottom Left) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 6 }}
        style={{ position: 'absolute', bottom: '40px', left: '40px', opacity: 0.15 }}
      >
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.65rem', color: '#fff', letterSpacing: '0.2em', marginBottom: '4px' }}>
          UNIVERSE FLOW OS v2.4.75
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--color-text-secondary)', letterSpacing: '0.1em' }}>
          QUANTUM LINK SECURE // AUTHENTICATION PENDING
        </div>
      </motion.div>

    </div>
  );
}
