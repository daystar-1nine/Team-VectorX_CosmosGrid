import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';
import './UI.css';

export function BottomAIConsole() {
  return (
    <motion.div 
      className="bottom-ai-console glass-panel panel"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 2.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="panel-header" style={{ borderBottom: 'none', paddingBottom: '0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Terminal size={14} color="var(--color-accent-highlight)" />
          <span style={{ color: 'var(--color-text-secondary)' }}>SYSTEM TERMINAL</span>
        </div>
      </div>
      <div className="panel-content" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span className="data-value" style={{ color: 'var(--color-text-muted)' }}>&gt; Initializing quantum subsystems... [OK]</span>
        <span className="data-value" style={{ color: 'var(--color-text-muted)' }}>&gt; Calibrating spatial distortion metrics... [OK]</span>
        <span className="data-value" style={{ color: 'var(--color-text-primary)' }}>&gt; Awaiting Commander input_</span>
      </div>
    </motion.div>
  );
}
