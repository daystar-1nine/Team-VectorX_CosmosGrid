import { motion } from 'framer-motion';
import { ThreatScanner } from '../widgets/ThreatScanner';
import { MissionFeed } from '../widgets/MissionFeed';
import { SpaceWeather } from '../widgets/SpaceWeather';
import './UI.css';

export function RightIntelligencePanel() {
  return (
    <motion.div 
      className="right-intelligence-panel"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 1.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <div style={{ flexShrink: 0 }}><ThreatScanner /></div>
      <div style={{ flexShrink: 0 }}><SpaceWeather /></div>
      <div style={{ flexShrink: 0 }}><MissionFeed /></div>
    </motion.div>
  );
}
