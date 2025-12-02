import { create } from 'zustand';
import { EnvironmentData, Location, Alert, Incident, Sensor } from '@/types';

interface AppStore {
  location: Location | null;
  setLocation: (location: Location) => void;

  environmentData: EnvironmentData | null;
  setEnvironmentData: (data: EnvironmentData) => void;

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

  sensors: [
    {
      id: 's1',
      name: 'Ben Thanh Sensor',
      latitude: 10.7722,
      longitude: 106.6986,
      type: 'air_quality',
      status: 'active',
      lastReading: { aqi: 85, temperature: 32, humidity: 78 },
    },
    {
      id: 's2',
      name: 'District 2 Sensor',
      latitude: 10.7896,
      longitude: 106.7441,
      type: 'air_quality',
      status: 'active',
      lastReading: { aqi: 95, temperature: 31, humidity: 80 },
    },
    {
      id: 's3',
      name: 'Thu Duc Sensor',
      latitude: 10.8508,
      longitude: 106.7717,
      type: 'weather',
      status: 'active',
      lastReading: { temperature: 33, humidity: 75 },
    },
  ],
  setSensors: (sensors) => set({ sensors }),

  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
