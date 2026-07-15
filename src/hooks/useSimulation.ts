import { useEffect } from 'react';
import { useAppStore } from '../store';

export function useSimulation() {
  const { 
    activeCrisis, 
    setMetric, 
    coreIntegrity, 
    gridStability, 
    energyOutput, 
    radiationLevel,
    addMissionLog
  } = useAppStore();

  useEffect(() => {
    // The main simulation tick runs every 2 seconds
    const tickInterval = setInterval(() => {
      
      // Calculate continuous metric perturbations
      if (activeCrisis === 'NONE') {
        // Normal state: metrics drift slightly around optimal values
        const newCore = Math.min(100, Math.max(90, coreIntegrity + (Math.random() - 0.4) * 0.2));
        const newEnergy = Math.min(100, Math.max(80, energyOutput + (Math.random() - 0.5) * 1.5));
        
        // Grid stability responds inversely to high energy output
        let stabilityDelta = (Math.random() - 0.5) * 0.5;
        if (newEnergy > 95) stabilityDelta -= 1.0; 
        const newGrid = Math.min(100, Math.max(70, gridStability + stabilityDelta));

        setMetric('coreIntegrity', newCore);
        setMetric('energyOutput', newEnergy);
        setMetric('gridStability', newGrid);
        
        // Very rare random normal events
        if (Math.random() < 0.02) {
          addMissionLog({ desc: 'ROUTINE GRID SYNCHRONIZATION COMPLETE', status: 'normal' });
        }

      } else if (activeCrisis === 'SOLAR_STORM') {
        // Solar Storm: High radiation, soaring energy, plummeting grid
        const newRad = radiationLevel + Math.random() * 2.0;
        const newEnergy = Math.min(150, energyOutput + Math.random() * 3.0); // Overload
        const newGrid = Math.max(20, gridStability - (newEnergy > 120 ? 2.0 : 0.5));
        
        setMetric('radiationLevel', newRad);
        setMetric('energyOutput', newEnergy);
        setMetric('gridStability', newGrid);

      } else if (activeCrisis === 'BLACK_HOLE_EXPANSION') {
        // Black Hole: Rapid core integrity loss, grid collapse
        const newCore = Math.max(10, coreIntegrity - Math.random() * 1.5);
        const newGrid = Math.max(10, gridStability - Math.random() * 2.0);
        
        setMetric('coreIntegrity', newCore);
        setMetric('gridStability', newGrid);
      } else if (activeCrisis === 'LANE_COLLAPSE') {
        // Lane Collapse: Grid stability fluctuates wildly
        const newGrid = Math.max(30, gridStability + (Math.random() - 0.7) * 3.0);
        setMetric('gridStability', newGrid);
      }

    }, 2000);

    return () => clearInterval(tickInterval);
  }, [activeCrisis, coreIntegrity, gridStability, energyOutput, radiationLevel, setMetric, addMissionLog]);

}
