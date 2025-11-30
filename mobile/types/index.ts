export interface Location {
  latitude: number;
  longitude: number;
}

export interface EnvironmentData {
  temperature: number;
  humidity: number;
  aqi: number;
  clouds: number;
  windSpeed: number;
  pressure: number;
  description: string;
  icon: string;
  location: string;
  timestamp: number;
}

export interface Sensor {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: 'air_quality' | 'weather' | 'water';
  status: 'active' | 'inactive';
  lastReading: {
    aqi?: number;
    temperature?: number;
    humidity?: number;
  };
}

export interface Alert {
  id: string;
  type: 'aqi' | 'flood' | 'landslide' | 'weather';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  location?: string;
  read: boolean;
}

export interface Incident {
  id: string;
  type: 'flood' | 'landslide' | 'pollution' | 'accident';
  description: string;
  imageUri?: string;
  location: Location;
  locationName?: string;
  timestamp: number;
  status: 'pending' | 'verified' | 'resolved';
  userId?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  token?: string;
}
