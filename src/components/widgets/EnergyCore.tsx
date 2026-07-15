import { motion, useSpring, useTransform } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useEffect } from 'react';
import { useAppStore } from '../../store';

export function EnergyCore() {
  const { energyOutput } = useAppStore();
  
  const isOverloaded = energyOutput > 100;
  
  // Smooth number
  const energySpring = useSpring(energyOutput, { stiffness: 40, damping: 20 });
  useEffect(() => { energySpring.set(energyOutput); }, [energyOutput, energySpring]);
  const displayEnergy = useTransform(energySpring, (v) => v.toFixed(1) + '%');

  const strokeColor = isOverloaded ? 'var(--color-status-danger)' : 'var(--color-accent-highlight)';
  const glowColor = isOverloaded ? 'rgba(255, 91, 127, 0.4)' : 'rgba(0, 255, 170, 0.2)';

  return (
    <div className="glass-panel panel widget" style={{ flex: 1, borderColor: isOverloaded ? 'var(--color-status-danger)' : undefined }}>
      <div className="panel-header" style={{ borderBottom: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={14} color={strokeColor} />
          <span style={{ color: strokeColor }}>ENERGY CORE</span>
        </div>
      </div>
      <div className="panel-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', position: 'relative' }}>
        
        <div style={{ position: 'relative', width: '160px', height: '160px' }}>
          
          {/* Inner Glow */}
          <motion.div 
            style={{ 
              position: 'absolute', top: '10%', left: '10%', width: '80%', height: '80%', 
              borderRadius: '50%', background: glowColor, filter: 'blur(20px)', zIndex: 0 
            }}
            animate={{ scale: isOverloaded ? [1, 1.2, 1] : [1, 1.05, 1], opacity: isOverloaded ? [0.6, 1, 0.6] : [0.3, 0.5, 0.3] }}
            transition={{ duration: isOverloaded ? 0.2 : 2, repeat: Infinity }}
          />

          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)', zIndex: 1, position: 'relative' }}>
            
            {/* Outer Static Track */}
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="2" />
            
            {/* Outer Rotating Dashed Ring */}
            <motion.circle 
              cx="50" cy="50" r="45" fill="none" stroke="var(--color-accent-primary)" strokeWidth="1" strokeDasharray="4 8"
              animate={{ rotate: 360 }}
              transition={{ duration: isOverloaded ? 2 : 10, repeat: Infinity, ease: "linear" }}
              style={{ originX: '50px', originY: '50px' }}
            />

            {/* Middle Rotating Dashed Ring */}
            <motion.circle 
              cx="50" cy="50" r="38" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" strokeDasharray="10 20"
              animate={{ rotate: -360 }}
              transition={{ duration: isOverloaded ? 3 : 15, repeat: Infinity, ease: "linear" }}
              style={{ originX: '50px', originY: '50px' }}
            />

            {/* Inner Power Track */}
            <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="4" />
            
            {/* Live Power Output Line */}
            <motion.circle
              cx="50" cy="50" r="30" fill="none"
              stroke={strokeColor}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="188.5"
              animate={{ strokeDashoffset: 188.5 - (188.5 * Math.min(100, energyOutput)) / 100 }}
              transition={{ duration: 0.5 }}
              style={{ filter: `drop-shadow(0 0 5px ${strokeColor})` }}
            />
          </svg>

          {/* Center Content */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 2 }}>
            <motion.span 
              className="data-value" 
              style={{ fontSize: '2rem', color: strokeColor }}
              animate={isOverloaded ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.2, repeat: Infinity }}
            >
              {displayEnergy}
            </motion.span>
            <span className="data-label">OUTPUT</span>
          </div>
        </div>
      </div>
    </div>
  );
}
