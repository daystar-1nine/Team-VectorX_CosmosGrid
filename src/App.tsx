import { useAppStore } from './store';
import { BootSequence } from './components/BootSequence';
import { Scene } from './components/3d/Scene';
import { Dashboard } from './components/Dashboard';
import { MissionBriefing } from './components/modules/MissionBriefing';
import { ClassifiedDossier } from './components/modules/ClassifiedDossier';
import { UniverseLore } from './components/modules/UniverseLore';
import { InteractiveGalaxyUI } from './components/modules/InteractiveGalaxyUI';
import { AnimatePresence } from 'framer-motion';
import './index.css';

function App() {
  const activeModule = useAppStore((state) => state.activeModule);
  const setActiveModule = useAppStore((state) => state.setActiveModule);

  return (
    <div className="app-container" style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      
      {/* Persistent 3D Environment */}
      <div className="canvas-container" style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0 }}>
        <Scene />
      </div>

      {/* 2D Module Transitions */}
      <AnimatePresence mode="wait">
        {activeModule === 'boot' && (
          <BootSequence key="boot" onComplete={() => setActiveModule('mission_briefing')} />
        )}
        
        {activeModule === 'mission_briefing' && (
          <MissionBriefing key="mission_briefing" onProceed={() => setActiveModule('command_center')} />
        )}

        {activeModule === 'command_center' && (
          <Dashboard key="command_center" />
        )}

        {activeModule === 'classified_dossier' && (
          <ClassifiedDossier key="classified_dossier" />
        )}

        {activeModule === 'universe' && (
          <UniverseLore key="universe" />
        )}
        
        {activeModule === 'interactive_galaxy' && (
          <InteractiveGalaxyUI key="interactive_galaxy" />
        )}
      </AnimatePresence>

    </div>
  );
}

export default App;
