import { motion } from 'framer-motion';
import { LeftNavigation } from './ui/LeftNavigation';
import { TopCommandBar } from './ui/TopCommandBar';
import { RightIntelligencePanel } from './ui/RightIntelligencePanel';
import { BottomAIConsole } from './ui/BottomAIConsole';
import { UniverseHealth, GridStability, EmergencyControls } from './widgets/CommandCenterWidgets';
import { GlobalAlerts } from './ui/GlobalAlerts';
import { useSimulation } from '../hooks/useSimulation';
import './Dashboard.css';

export function Dashboard() {
  // Initialize the living universe simulation
  useSimulation();
  return (
    <motion.div 
      className="dashboard-container"
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, pointerEvents: 'auto' }}
    >
      <GlobalAlerts />
      {/* 2D UI Overlay */}
      <div className="cosmos-grid">
        <TopCommandBar />
        <LeftNavigation />
        
        <div className="center-command-panel">
          <div style={{ flexShrink: 0 }}><UniverseHealth /></div>
          <div style={{ flexShrink: 0 }}><GridStability /></div>
          <div style={{ flexShrink: 0 }}><EmergencyControls /></div>
          <div style={{ flexShrink: 0 }}><BottomAIConsole /></div>
        </div>

        <RightIntelligencePanel />
      </div>
    </motion.div>
  );
}
