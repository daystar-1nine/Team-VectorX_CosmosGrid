import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Crosshair, Hexagon, Database, Power } from 'lucide-react';
import { EnergyCore } from '../widgets/EnergyCore';
import { useAppStore } from '../../store';
import type { ModuleState } from '../../store';
import { useState } from 'react';
import './UI.css';

export function LeftNavigation() {
  const activeModule = useAppStore(state => state.activeModule);
  const setActiveModule = useAppStore(state => state.setActiveModule);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const navItems: { icon: any; label: string; module: ModuleState }[] = [
    { icon: <Compass size={20} />, label: 'GALAXY MAP', module: 'interactive_galaxy' },
    { icon: <Crosshair size={20} />, label: 'COMMAND CTRL', module: 'command_center' },
    { icon: <Hexagon size={20} />, label: 'UNIVERSE LORE', module: 'universe' },
    { icon: <Database size={20} />, label: 'DOSSIER', module: 'classified_dossier' },
  ];

  return (
    <motion.div 
      className="left-navigation"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 1.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="glass-panel panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px 0', position: 'relative' }}>
        
        {navItems.map((item, idx) => {
          const isActive = activeModule === item.module;
          const isHovered = hoveredNode === item.module;
          
          return (
            <motion.div 
              key={idx}
              onMouseEnter={() => setHoveredNode(item.module)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => setActiveModule(item.module)}
              whileHover={{ x: 4 }}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                padding: '24px 0',
                cursor: 'pointer',
                color: isActive ? 'var(--color-accent-primary)' : (isHovered ? '#fff' : 'var(--color-text-secondary)'),
                transition: 'color 0.3s ease'
              }}
            >
              {/* Active Indicator Glow */}
              <AnimatePresence>
                {isActive && (
                  <motion.div 
                    layoutId="activeNavIndicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      position: 'absolute', right: -2, top: 0, bottom: 0, width: 4, 
                      background: 'var(--color-accent-primary)',
                      boxShadow: '0 0 10px var(--color-accent-primary)',
                      borderRadius: '4px 0 0 4px'
                    }}
                  />
                )}
                {isHovered && !isActive && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    style={{ position: 'absolute', width: 40, height: 40, borderRadius: '50%', background: 'rgba(0, 229, 255, 0.1)', zIndex: -1 }}
                  />
                )}
              </AnimatePresence>

              <motion.div
                animate={isActive ? { scale: [1, 1.1, 1], filter: ['drop-shadow(0 0 0px #00E5FF)', 'drop-shadow(0 0 10px #00E5FF)', 'drop-shadow(0 0 0px #00E5FF)'] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {item.icon}
              </motion.div>
              <span className="data-label" style={{ fontSize: '0.65rem' }}>{item.label}</span>
            </motion.div>
          )
        })}

        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', padding: '24px 0', cursor: 'pointer' }}>
          <motion.div
            whileHover={{ scale: 1.1, filter: 'drop-shadow(0 0 10px rgba(255, 91, 127, 0.8))' }}
            whileTap={{ scale: 0.9 }}
            style={{ color: 'var(--color-status-danger)' }}
          >
            <Power size={20} />
          </motion.div>
        </div>
      </div>
      
      <div style={{ height: '220px', flexShrink: 0, display: 'flex' }}>
        <EnergyCore />
      </div>
    </motion.div>
  );
}
