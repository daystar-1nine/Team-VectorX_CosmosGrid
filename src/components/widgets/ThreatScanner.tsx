import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export function ThreatScanner() {
  // A bespoke visualization using simple div bars for a topographic waveform
  const bars = Array.from({ length: 40 }, () => Math.random() * 100);

  return (
    <div className="glass-panel panel widget">
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={14} color="var(--color-status-danger)" />
          <span style={{ color: 'var(--color-status-danger)' }}>THREAT SCANNER</span>
        </div>
        <span className="data-value" style={{ color: 'var(--color-status-danger)' }}>02 DETECTED</span>
      </div>
      
      <div className="panel-content" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Waveform visualization */}
        <div style={{ height: '60px', display: 'flex', alignItems: 'flex-end', gap: '2px', paddingBottom: '8px', borderBottom: '1px solid var(--glass-border)' }}>
          {bars.map((val, idx) => (
            <motion.div 
              key={idx}
              style={{
                flex: 1,
                backgroundColor: idx > 25 && idx < 32 ? 'var(--color-status-danger)' : 'var(--color-accent-primary)',
                opacity: idx > 25 && idx < 32 ? 1 : 0.3
              }}
              animate={{ height: [`${val}%`, `${Math.random() * 100}%`, `${val}%`] }}
              transition={{ repeat: Infinity, duration: 1.5 + Math.random(), ease: 'easeInOut' }}
            />
          ))}
        </div>

        {/* Threat List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255, 91, 127, 0.1)', padding: '8px', borderLeft: '2px solid var(--color-status-danger)' }}>
            <span className="data-value">SECTOR 7G ANOMALY</span>
            <span className="data-value" style={{ color: 'var(--color-status-danger)' }}>DIST: 4.2 LY</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', borderLeft: '2px solid var(--color-status-warning)', opacity: 0.8 }}>
            <span className="data-value">UNREGISTERED VESSEL</span>
            <span className="data-value" style={{ color: 'var(--color-status-warning)' }}>DIST: 12.1 LY</span>
          </div>
        </div>

      </div>
    </div>
  );
}
