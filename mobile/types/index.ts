export interface Location {
  latitude: number;
  longitude: number;
}

export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
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

// Air Quality Types from Backend API
export interface Pollutants {
  co?: number;
  no?: number;
  no2?: number;
  o3?: number;
  so2?: number;
  pm25?: number;
  pm10?: number;
  nh3?: number;
}

export interface AQI {
  openWeather: {
    index: number;
    level: string;
  };
  epaUS: {
    index: number;
    level: string;
  };
}

export interface AirQualityData {
  id: string;
  stationId: string;
  location: {
    lat: number;
    lon: number;
  };
  address?: string;
  dateObserved: string;
  pollutants: Pollutants;
  aqi: AQI;
}

export interface NearestStationInfo {
  code: string;
  name: string;
  distance: number; // in kilometers
}

export interface NearbyAirQualityResponse {
  nearestStation: NearestStationInfo;
  current?: AirQualityData;
  forecast?: Array<AirQualityData & { validFrom?: string; validTo?: string }>;
  source: 'orion-ld';
  timestamp: string;
  validUntil: string;
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
