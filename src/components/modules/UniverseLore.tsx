import { motion } from 'framer-motion';
import { useAppStore } from '../../store';
import { ArrowLeft, Clock } from 'lucide-react';
import { useState } from 'react';

export function UniverseLore() {
  const setActiveModule = useAppStore(state => state.setActiveModule);
  const [activeEra, setActiveEra] = useState(0);

  const timeline = [
    { year: "2150", title: "THE DISCOVERY", desc: "Humanity discovers the Gravity Grid, an ancient network of sub-space lanes left by the Architects." },
    { year: "2314", title: "ITA FORMED", desc: "The Interstellar Transit Authority is formed to regulate and protect the grid." },
    { year: "2450", title: "THE CORRUPTION", desc: "First signs of grid destabilization appear in the Outer Rim. Anomalies detected." },
    { year: "2475", title: "GRIDLOCK", desc: "Present day. The OS is under immense strain. The corruption spreads." }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 10, padding: '10vw', pointerEvents: 'none' }}
    >
      <div style={{ pointerEvents: 'auto', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <motion.button 
            onClick={() => setActiveModule('command_center')}
            whileHover={{ x: -5, color: 'var(--color-accent-primary)' }}
            style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <ArrowLeft size={24} />
          </motion.button>
          <h1 style={{ margin: 0, letterSpacing: '0.2em' }}>UNIVERSE ARCHIVE</h1>
        </div>

        {/* Interactive Timeline */}
        <div className="glass-panel" style={{ padding: '48px', display: 'flex', gap: '48px', alignItems: 'flex-start' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flexShrink: 0 }}>
            {timeline.map((era, idx) => (
              <motion.div 
                key={idx}
                onClick={() => setActiveEra(idx)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer',
                  opacity: activeEra === idx ? 1 : 0.5,
                  transition: 'opacity 0.3s'
                }}
              >
                <div style={{ 
                  width: '12px', height: '12px', borderRadius: '50%', 
                  background: activeEra === idx ? 'var(--color-accent-primary)' : 'var(--glass-border)',
                  boxShadow: activeEra === idx ? '0 0 10px var(--color-accent-primary)' : 'none'
                }} />
                <span className="data-value" style={{ fontSize: '1.2rem', color: activeEra === idx ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)' }}>
                  {era.year}
                </span>
              </motion.div>
            ))}
          </div>

          <div style={{ width: '1px', background: 'var(--glass-border)', alignSelf: 'stretch' }} />

          <motion.div 
            key={activeEra}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '500px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-accent-highlight)' }}>
              <Clock size={16} />
              <span className="data-label">{timeline[activeEra].title}</span>
            </div>
            <p style={{ fontSize: '1.2rem', lineHeight: 1.6, color: 'var(--color-text-primary)' }}>
              {timeline[activeEra].desc}
            </p>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}
