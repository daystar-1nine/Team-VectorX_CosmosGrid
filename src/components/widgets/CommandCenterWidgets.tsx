import { motion, useSpring, useTransform } from 'framer-motion';
import { HeartPulse, Network, Zap, AlertOctagon, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAppStore } from '../../store';

export function UniverseHealth() {
  const { coreIntegrity, gridStability, activeCrisis } = useAppStore();
  
  // Smooth animated numbers using framer-motion springs
  const integritySpring = useSpring(coreIntegrity, { stiffness: 50, damping: 20 });
  const entitiesSpring = useSpring(1200000000, { stiffness: 20, damping: 40 });
  
  useEffect(() => {
    integritySpring.set(coreIntegrity);
    // Perturb entity count slightly based on stability
    entitiesSpring.set(1200000000 + (gridStability * 100000));
  }, [coreIntegrity, gridStability, integritySpring, entitiesSpring]);

  const displayIntegrity = useTransform(integritySpring, (v) => v.toFixed(1) + '%');
  const displayEntities = useTransform(entitiesSpring, (v) => (v / 1000000000).toFixed(2) + 'B');

  const isCritical = coreIntegrity < 50;

  return (
    <div className="glass-panel panel widget" style={{ flex: 1, borderColor: isCritical ? 'var(--color-status-danger)' : undefined }}>
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HeartPulse size={14} color={isCritical ? "var(--color-status-danger)" : "var(--color-status-success)"} />
          <span style={{ color: isCritical ? 'var(--color-status-danger)' : 'var(--color-status-success)' }}>UNIVERSE HEALTH</span>
        </div>
        <motion.span 
          animate={isCritical ? { opacity: [1, 0, 1] } : {}}
          transition={{ repeat: Infinity, duration: 0.5 }}
          className="data-value" 
          style={{ color: isCritical ? 'var(--color-status-danger)' : 'var(--color-text-secondary)' }}
        >
          {activeCrisis !== 'NONE' ? 'CRITICAL' : 'STABLE'}
        </motion.span>
      </div>
      <div className="panel-content" style={{ display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'space-around', position: 'relative' }}>
        
        {/* EKG Pulse Background */}
        <div style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.1, pointerEvents: 'none' }}>
           <svg width="100%" height="100%" viewBox="0 0 200 50" preserveAspectRatio="none">
             <motion.path 
               d="M0 25 L40 25 L50 5 L60 45 L70 25 L200 25"
               fill="none" 
               stroke={isCritical ? "var(--color-status-danger)" : "var(--color-status-success)"} 
               strokeWidth="2"
               initial={{ pathLength: 0, opacity: 0 }}
               animate={{ pathLength: 1, opacity: 1 }}
               transition={{ duration: isCritical ? 0.5 : 2, repeat: Infinity, ease: "linear" }}
             />
           </svg>
        </div>

        <div style={{ textAlign: 'center', zIndex: 1 }}>
          <motion.span className="data-value" style={{ fontSize: '2.5rem', color: isCritical ? 'var(--color-status-danger)' : 'var(--color-status-success)' }}>
            {displayIntegrity}
          </motion.span>
          <br/><span className="data-label">CORE INTEGRITY</span>
        </div>
        <div style={{ width: '1px', height: '40px', background: 'var(--glass-border)' }} />
        <div style={{ textAlign: 'center', zIndex: 1 }}>
          <motion.span className="data-value" style={{ fontSize: '2.5rem', color: 'var(--color-accent-highlight)' }}>
            {displayEntities}
          </motion.span>
          <br/><span className="data-label">ENTITIES TRACKED</span>
        </div>
      </div>
    </div>
  );
}

export function GridStability() {
  const { gridStability } = useAppStore();
  const isCritical = gridStability < 40;
  
  return (
    <div className="glass-panel panel widget" style={{ flex: 1 }}>
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Network size={14} color={isCritical ? "var(--color-status-danger)" : "var(--color-accent-primary)"} />
          <span style={{ color: isCritical ? 'var(--color-status-danger)' : 'var(--color-accent-primary)' }}>GRID STABILITY</span>
        </div>
        <span className="data-value" style={{ color: isCritical ? 'var(--color-status-danger)' : 'var(--color-accent-primary)' }}>
          {gridStability.toFixed(1)}%
        </span>
      </div>
      <div className="panel-content" style={{ position: 'relative', height: '120px', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* Animated Node Graph Simulation */}
        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
          {[0, 1, 2, 3, 4].map((node) => {
            // If grid stability is low, some nodes start failing (turning red and dropping)
            const isFailing = isCritical && node % 2 === 0;
            return (
              <div key={node} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <motion.div 
                  animate={{ 
                    y: isFailing ? [0, 10, 0] : [0, -5, 0],
                    scale: isFailing ? [1, 0.8, 1] : 1
                  }}
                  transition={{ duration: isFailing ? 0.2 : 2 + node * 0.5, repeat: Infinity }}
                  style={{ 
                    width: '12px', 
                    height: '12px', 
                    borderRadius: '50%', 
                    background: isFailing ? 'var(--color-status-danger)' : 'var(--color-accent-primary)',
                    boxShadow: `0 0 10px ${isFailing ? 'var(--color-status-danger)' : 'var(--color-accent-primary)'}`
                  }} 
                />
              </div>
            );
          })}
        </div>
        
        {/* Connecting Lines */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <motion.path 
            d="M 30 60 L 100 60 L 170 60 L 240 60 L 310 60" 
            fill="none" 
            stroke={isCritical ? "rgba(255, 0, 50, 0.5)" : "rgba(0, 229, 255, 0.3)"} 
            strokeWidth="2" 
            animate={{ strokeDashoffset: [100, 0] }}
            transition={{ duration: isCritical ? 0.5 : 2, repeat: Infinity, ease: 'linear' }}
            strokeDasharray="10 10"
          />
        </svg>
      </div>
    </div>
  );
}

export function EmergencyControls() {
  const { triggerCrisis, resolveCrisis } = useAppStore();
  const [locked, setLocked] = useState(true);

  const renderButton = (icon: any, label: string, action: () => void, danger: boolean = false) => (
    <motion.button
      whileHover={!locked ? { scale: 1.02, backgroundColor: danger ? 'rgba(255, 91, 127, 0.15)' : 'rgba(0, 229, 255, 0.1)' } : {}}
      whileTap={!locked ? { scale: 0.98 } : {}}
      onClick={() => { if (!locked) action(); }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '16px 8px',
        background: 'rgba(255, 255, 255, 0.02)',
        border: `1px solid ${locked ? 'var(--glass-border)' : (danger ? 'var(--color-status-danger)' : 'var(--color-accent-primary)')}`,
        borderRadius: '8px',
        cursor: locked ? 'not-allowed' : 'pointer',
        opacity: locked ? 0.5 : 1,
        color: 'var(--color-text-primary)',
        transition: 'all 0.3s'
      }}
    >
      {icon}
      <span style={{ fontSize: '0.7rem', textAlign: 'center', fontFamily: 'var(--font-heading)' }}>{label}</span>
    </motion.button>
  );

  return (
    <div className="glass-panel panel widget" style={{ flex: 1, borderColor: locked ? 'var(--glass-border)' : 'var(--color-status-danger)' }}>
      <div className="panel-header" style={{ borderBottomColor: locked ? 'var(--glass-border)' : 'rgba(255, 91, 127, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertOctagon size={14} color="var(--color-status-danger)" />
          <span style={{ color: 'var(--color-status-danger)' }}>EMERGENCY OVERRIDE (SIMULATION CONTROLS)</span>
        </div>
        <button 
          onClick={() => setLocked(!locked)}
          style={{
            background: locked ? 'transparent' : 'var(--color-status-danger)',
            border: `1px solid var(--color-status-danger)`,
            color: locked ? 'var(--color-status-danger)' : '#fff',
            padding: '4px 12px',
            borderRadius: '4px',
            fontFamily: 'var(--font-heading)',
            fontSize: '0.7rem',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          {locked ? 'UNLOCK CONSOLE' : 'ARMED'}
        </button>
      </div>
      
      <div className="panel-content" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {renderButton(<Zap size={20} color="var(--color-status-warning)" />, "SOLAR STORM", () => triggerCrisis('SOLAR_STORM'))}
        {renderButton(<AlertOctagon size={20} color="var(--color-status-danger)" />, "BLACK HOLE", () => triggerCrisis('BLACK_HOLE_EXPANSION'), true)}
        {renderButton(<Network size={20} color="#8A2BE2" />, "LANE COLLAPSE", () => triggerCrisis('LANE_COLLAPSE'))}
        {renderButton(<RotateCcw size={20} color="var(--color-status-success)" />, "RECOVER SYSTEM", () => resolveCrisis())}
      </div>
    </div>
  );
}
