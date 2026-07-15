import { motion } from 'framer-motion';
import { ArrowLeft, Crosshair, Map } from 'lucide-react';
import { useAppStore } from '../../store';

export function InteractiveGalaxyUI() {
  const setActiveModule = useAppStore(state => state.setActiveModule);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 10, padding: '40px' }}
    >
      {/* Top HUD */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        
        {/* Back Button */}
        <motion.button 
          onClick={() => setActiveModule('command_center')}
          whileHover={{ x: -5, backgroundColor: 'rgba(0, 229, 255, 0.2)' }}
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(0, 229, 255, 0.1)',
            border: '1px solid var(--color-accent-primary)',
            color: 'var(--color-accent-primary)',
            padding: '12px 24px',
            borderRadius: '4px',
            fontFamily: 'var(--font-heading)',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)'
          }}
        >
          <ArrowLeft size={18} />
          RETURN TO COMMAND
        </motion.button>

        {/* Mode Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>
          <Map size={16} />
          <span>FREE-CAM ENGAGED</span>
        </div>
      </div>

      {/* Target Reticle */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.2 }}>
        <Crosshair size={40} color="var(--color-accent-primary)" />
      </div>
    </motion.div>
  );
}
