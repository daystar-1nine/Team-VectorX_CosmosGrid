import { motion } from 'framer-motion';
import { Wifi, Shield, Activity, Clock } from 'lucide-react';
import { useAppStore } from '../../store';
import { useEffect, useState } from 'react';

export function TopCommandBar() {
  const { coreIntegrity, gridStability, activeCrisis } = useAppStore();
  
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isCritical = activeCrisis !== 'NONE';
  const systemLoad = (200 - coreIntegrity - gridStability).toFixed(1); // Rough calculation

  const renderStat = (icon: any, label: string, value: string, color: string, animated: boolean = false) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {animated ? (
        <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
          {icon}
        </motion.div>
      ) : icon}
      <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem', fontFamily: 'var(--font-heading)' }}>{label}</span>
      <span style={{ color, fontSize: '0.85rem', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>{value}</span>
    </div>
  );

  return (
    <div className="top-command-bar panel">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <h1 style={{ color: 'var(--color-accent-primary)', fontSize: '1.2rem', margin: 0, textShadow: '0 0 10px rgba(0,229,255,0.3)' }}>COSMOS GRID</h1>
        <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>V2.4.75</span>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        {renderStat(<Wifi size={16} color="var(--color-status-success)" />, "QUANTUM LINK", "SECURE", "var(--color-status-success)", !isCritical)}
        {renderStat(
          <Shield size={16} color={isCritical ? "var(--color-status-danger)" : "var(--color-accent-primary)"} />, 
          "DEFENSE COND", 
          isCritical ? "CRITICAL" : "GREEN", 
          isCritical ? "var(--color-status-danger)" : "var(--color-accent-primary)",
          isCritical
        )}
        {renderStat(<Activity size={16} color="var(--color-accent-highlight)" />, "SYS LOAD", `${systemLoad}%`, "var(--color-accent-highlight)")}
        {renderStat(<Clock size={16} color="var(--color-text-primary)" />, "UNIVERSE TIME", time, "var(--color-text-primary)")}
      </div>
    </div>
  );
}
