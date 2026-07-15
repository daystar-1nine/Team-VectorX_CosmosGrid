import { motion, useSpring, useTransform } from 'framer-motion';
import { CloudRain } from 'lucide-react';
import { useAppStore } from '../../store';
import { useEffect, useState } from 'react';

export function SpaceWeather() {
  const { radiationLevel, activeCrisis } = useAppStore();
  
  const isSolarStorm = activeCrisis === 'SOLAR_STORM';
  const color = isSolarStorm ? 'var(--color-status-danger)' : 'var(--color-status-warning)';

  // Animated number
  const radSpring = useSpring(radiationLevel, { stiffness: 60, damping: 20 });
  useEffect(() => { radSpring.set(radiationLevel); }, [radiationLevel, radSpring]);
  const displayRad = useTransform(radSpring, (v) => v.toFixed(2) + ' Sv/h');

  // Animated Chart Data
  const [chartData, setChartData] = useState<number[]>(Array(15).fill(20));
  
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev => {
        const newData = [...prev.slice(1)];
        // Generate new point based on current radiation
        const variance = isSolarStorm ? (Math.random() * 50 + 50) : (Math.random() * 20 + 10);
        newData.push(variance);
        return newData;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSolarStorm]);

  return (
    <div className="glass-panel panel widget" style={{ flex: 1, borderColor: isSolarStorm ? color : undefined }}>
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CloudRain size={14} color={color} />
          <span style={{ color: color }}>SPACE WEATHER</span>
        </div>
        <motion.span 
          animate={isSolarStorm ? { opacity: [1, 0, 1] } : {}}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="data-value" 
          style={{ color }}
        >
          {isSolarStorm ? 'SOLAR FLARE ACTIVE' : 'NOMINAL'}
        </motion.span>
      </div>
      
      <div className="panel-content" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <span className="data-label">RADIATION LEVEL</span><br/>
          <motion.span className="data-value" style={{ fontSize: '1.5rem', color: isSolarStorm ? '#fff' : 'var(--color-text-primary)', textShadow: isSolarStorm ? `0 0 10px ${color}` : 'none' }}>
            {displayRad}
          </motion.span>
        </div>

        {/* Animated Bar Chart */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '60px', width: '100%' }}>
          {chartData.map((val, i) => (
            <motion.div
              key={i}
              animate={{ height: `${val}%`, backgroundColor: val > 70 ? 'var(--color-status-danger)' : color }}
              transition={{ type: 'spring', stiffness: 100 }}
              style={{ flex: 1, borderRadius: '2px', opacity: 0.8 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
