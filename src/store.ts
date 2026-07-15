import { create } from 'zustand';

export type ModuleState = 'boot' | 'mission_briefing' | 'command_center' | 'classified_dossier' | 'universe' | 'interactive_galaxy';

export type CrisisType = 'NONE' | 'SOLAR_STORM' | 'BLACK_HOLE_EXPANSION' | 'LANE_COLLAPSE';

interface LogEntry {
  id: string;
  desc: string;
  time: string;
  status: 'normal' | 'pending' | 'critical';
}

interface AppState {
  activeModule: ModuleState;
  setActiveModule: (module: ModuleState) => void;
  
  // Alert System
  alertActive: boolean;
  alertMessage: string | null;
  triggerAlert: (message: string, duration?: number) => void;
  clearAlert: () => void;

  // Interconnected Simulation Metrics
  coreIntegrity: number; // 0-100
  gridStability: number; // 0-100
  energyOutput: number; // 0-100
  radiationLevel: number; // Sv/h
  activeCrisis: CrisisType;
  
  // AI State
  aiRecommendation: string;
  
  // Mission Feed
  missionLogs: LogEntry[];

  // Actions to mutate state
  setMetric: (metric: keyof AppState, value: any) => void;
  triggerCrisis: (crisis: CrisisType) => void;
  resolveCrisis: () => void;
  addMissionLog: (log: Omit<LogEntry, 'id' | 'time'>) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  activeModule: 'boot',
  setActiveModule: (module) => set({ activeModule: module }),
  
  alertActive: false,
  alertMessage: null,
  triggerAlert: (message, duration = 5000) => {
    set({ alertActive: true, alertMessage: message });
    setTimeout(() => {
      set({ alertActive: false, alertMessage: null });
    }, duration);
  },
  clearAlert: () => set({ alertActive: false, alertMessage: null }),

  // Simulation Metrics Defaults
  coreIntegrity: 98.4,
  gridStability: 95.0,
  energyOutput: 88.0,
  radiationLevel: 4.82,
  activeCrisis: 'NONE',
  
  aiRecommendation: "System optimal. Monitoring sector anomalies.",
  
  missionLogs: [
    { id: 'M-1092', desc: 'CARGO VESSEL DOCKED AT STATION ALPHA', time: '-02:14:00', status: 'normal' },
    { id: 'M-1093', desc: 'DEEP SPACE PROBE TELEMETRY RECEIVED', time: '-01:42:12', status: 'normal' },
    { id: 'M-1094', desc: 'ROUTINE MAINTENANCE ON SOLAR ARRAY', time: '-00:15:30', status: 'pending' },
  ],

  setMetric: (metric, value) => set({ [metric]: value }),
  
  triggerCrisis: (crisis) => {
    set({ activeCrisis: crisis });
    
    // Immediate state impacts based on crisis
    if (crisis === 'SOLAR_STORM') {
      get().triggerAlert("WARNING: SOLAR SUPERSTORM DETECTED", 8000);
      set({ radiationLevel: 45.5, energyOutput: 120.0, aiRecommendation: "High radiation detected. Recommend activating Omega Shield to prevent grid overload." });
      get().addMissionLog({ desc: 'SOLAR FLARE IMPACT IMMINENT', status: 'critical' });
    } else if (crisis === 'BLACK_HOLE_EXPANSION') {
      get().triggerAlert("CRITICAL: BLACK HOLE CONTAINMENT FAILING", 8000);
      set({ gridStability: 40.0, coreIntegrity: 70.0, aiRecommendation: "Spacetime distortion increasing. Deploy stabilization fleet immediately." });
      get().addMissionLog({ desc: 'SECTOR 4 GRAVITY ANOMALY', status: 'critical' });
    } else if (crisis === 'LANE_COLLAPSE') {
      get().triggerAlert("ALERT: GRAVITY LANE 07 DESTABILIZED", 8000);
      set({ gridStability: 60.0, aiRecommendation: "Lane 07 collapsed. Recommend rerouting Cargo Fleet through Warp Gate 12." });
      get().addMissionLog({ desc: 'TRAFFIC REROUTED FROM LANE 07', status: 'pending' });
    }
  },

  resolveCrisis: () => {
    set({ 
      activeCrisis: 'NONE', 
      radiationLevel: 4.82,
      aiRecommendation: "Crisis averted. Normalizing grid parameters.",
      coreIntegrity: 98.4
    });
    get().triggerAlert("SYSTEM RECOVERED: METRICS NORMALIZING", 4000);
    get().addMissionLog({ desc: 'CRISIS RESOLVED BY COMMANDER', status: 'normal' });
  },

  addMissionLog: (log) => {
    const id = `M-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const time = `-${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    set((state) => ({
      missionLogs: [{ id, time, ...log }, ...state.missionLogs].slice(0, 8) // Keep last 8
    }));
  }
}));
