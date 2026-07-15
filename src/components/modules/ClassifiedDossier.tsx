import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FileText, ArrowLeft } from 'lucide-react';
import { useAppStore } from '../../store';

export function ClassifiedDossier() {
  const setActiveModule = useAppStore(state => state.setActiveModule);
  const [lines, setLines] = useState<number>(0);

  const dossierContent = [
    "INTERSTELLAR TRANSIT AUTHORITY (ITA)",
    "ESTABLISHED: 2314 AD",
    "PURPOSE: Maintenance and stabilization of the Gravity Grid and Warp Gates.",
    "CURRENT CRISIS: The 'Corruption' - An unknown anomaly causing rapid grid destabilization.",
    "ARCHITECTS: REDACTED",
    "OPERATIONAL STATUS: SEVERE COMPROMISE IN SECTORS 4, 7, AND 9."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setLines(prev => (prev < dossierContent.length ? prev + 1 : prev));
    }, 800);
    return () => clearInterval(timer);
  }, [dossierContent.length]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 10, padding: '10vw' }}
    >
      <div style={{ display: 'flex', gap: '32px' }}>
        
        {/* Back Button */}
        <motion.button 
          onClick={() => setActiveModule('command_center')}
          whileHover={{ x: -5, color: 'var(--color-accent-primary)' }}
          style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', height: 'max-content' }}
        >
          <ArrowLeft size={24} />
        </motion.button>

        {/* Dossier Document */}
        <div className="glass-panel" style={{ flex: 1, maxWidth: '800px', padding: '48px', position: 'relative', overflow: 'hidden' }}>
          
          {/* Scanning Line Effect */}
          <motion.div 
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 4, ease: 'linear', repeat: Infinity }}
            style={{ position: 'absolute', left: 0, width: '100%', height: '2px', background: 'var(--color-accent-primary)', boxShadow: '0 0 20px var(--color-accent-primary)', opacity: 0.5, zIndex: 5 }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '24px' }}>
            <FileText size={32} color="var(--color-status-danger)" />
            <h1 style={{ color: 'var(--color-status-danger)', margin: 0, letterSpacing: '0.2em' }}>TOP SECRET // DOSSIER</h1>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <AnimatePresence>
              {dossierContent.slice(0, lines).map((line, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, filter: 'blur(5px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="data-value" style={{ 
                    color: line.includes('REDACTED') || line.includes('SEVERE') ? 'var(--color-status-danger)' : 'var(--color-text-primary)',
                    fontSize: '1rem',
                    margin: 0
                  }}>
                    {line}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
