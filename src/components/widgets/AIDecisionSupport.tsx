import { motion } from 'framer-motion';
import { Cpu, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store';

export function AIDecisionSupport() {
  const { aiRecommendation, activeCrisis } = useAppStore();
  
  const isCritical = activeCrisis !== 'NONE';

  return (
    <div className="glass-panel panel widget" style={{ flex: 1, borderColor: isCritical ? 'var(--color-status-warning)' : undefined }}>
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={14} color={isCritical ? "var(--color-status-warning)" : "var(--color-accent-highlight)"} />
          <span style={{ color: isCritical ? 'var(--color-status-warning)' : 'var(--color-accent-highlight)' }}>AI DECISION SUPPORT</span>
        </div>
        <motion.div 
          animate={{ opacity: [1, 0.5, 1] }} 
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: isCritical ? 'var(--color-status-warning)' : 'var(--color-status-success)' }} 
        />
      </div>
      <div className="panel-content" style={{ minHeight: '80px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <ChevronRight size={16} color="var(--color-text-secondary)" style={{ marginTop: '4px' }} />
        
        <motion.div
          key={aiRecommendation} // Forces re-render animation when text changes
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ 
            fontFamily: 'var(--font-mono)', 
            fontSize: '0.85rem', 
            color: isCritical ? '#fff' : 'var(--color-text-primary)',
            lineHeight: 1.6,
            textShadow: isCritical ? '0 0 10px rgba(255, 215, 0, 0.3)' : 'none'
          }}
        >
          {aiRecommendation}
        </motion.div>
      </div>
    </div>
  );
}
