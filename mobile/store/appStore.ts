import { create } from 'zustand';
import { EnvironmentData, Location, Alert, Incident, Sensor, AirQualityData } from '@/types';

interface AppStore {
  location: Location | null;
  setLocation: (location: Location) => void;

  environmentData: EnvironmentData | null;
  setEnvironmentData: (data: EnvironmentData) => void;

  airQualityData: AirQualityData | null;
  setAirQualityData: (data: AirQualityData) => void;

  alerts: Alert[];
  addAlert: (alert: Alert) => void;
  markAlertAsRead: (id: string) => void;

  incidents: Incident[];
  addIncident: (incident: Incident) => void;

  sensors: Sensor[];
  setSensors: (sensors: Sensor[]) => void;

  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  location: null,
  setLocation: (location) => set({ location }),

  environmentData: null,
  setEnvironmentData: (data) => set({ environmentData: data }),

  airQualityData: null,
  setAirQualityData: (data) => set({ airQualityData: data }),

  alerts: [
    {
      id: '1',
      type: 'aqi',
      title: 'High Air Quality Index',
      message: 'AQI has reached 156. Avoid outdoor activities.',
      severity: 'high',
      timestamp: Date.now() - 3600000,
      location: 'District 1',
      read: false,
    },
    {
      id: '2',
      type: 'weather',
      title: 'Heavy Rain Warning',
      message: 'Heavy rainfall expected in the next 2 hours.',
      severity: 'medium',
      timestamp: Date.now() - 7200000,
      location: 'District 3',
      read: false,
    },
  ],
  addAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts] })),
  markAlertAsRead: (id) =>
    set((state) => ({
      alerts: state.alerts.map((alert) => (alert.id === id ? { ...alert, read: true } : alert)),
    })),

  incidents: [],
  addIncident: (incident) => set((state) => ({ incidents: [incident, ...state.incidents] })),

  sensors: [],
  setSensors: (sensors) => set({ sensors }),

  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
