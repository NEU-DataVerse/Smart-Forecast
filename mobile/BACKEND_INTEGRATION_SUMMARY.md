# Backend Integration Summary

## Overview

Successfully connected the Smart Forecast mobile app to the backend API and updated the UI to display real air quality data from the backend instead of external OpenWeather API.

## Changes Made

### 1. API Service Update (`services/api.ts`)

**Changes:**

- Replaced OpenWeather API with Smart Forecast backend API
- Updated `BACKEND_API_URL` to use `EXPO_PUBLIC_API_URL` environment variable (defaults to `http://localhost:8000/api/v1`)
- Updated `getEnvironmentData()` to fetch from `/air-quality/nearby` endpoint
- Added `getCurrentAirQuality()` to fetch all stations' current data
- Added `getForecastAirQuality()` to fetch forecast data
- Added `getAllStations()` to fetch all weather stations
- Added `getNearestStations()` to fetch nearest stations by GPS coordinates

**Key Features:**

- Data transformation from backend format to app format
- Error handling with retry logic
- Support for location-based queries

### 2. Types Update (`types/index.ts`)

**Changes:**

- Added new `AirQualityData` interface matching backend response structure
- Includes pollutants data (CO, NO, NO2, O3, SO2, PM2.5, PM10, NH3)
- Includes AQI data from both OpenWeather and EPA standards
- Added temperature, humidity, pressure, windSpeed, clouds to air quality data

### 3. App Store Update (`store/appStore.ts`)

**Changes:**

- Added `airQualityData` state and setter for backend air quality data
- Removed hardcoded mock sensor data (sensors now fetched from backend)
- Initialized sensors as empty array (populated from backend)
- Added proper import for `AirQualityData` type

### 4. Home Screen Update (`app/(tabs)/index.tsx`)

**Changes:**

- Enhanced error handling with retry logic (3 retries, 1s delay)
- Improved loading state handling
- Better error logging for debugging
- Query remains focused on location-based air quality data

### 5. Map Screen Update (`app/(tabs)/map.tsx`)

**Changes:**

- Added `useQuery` to fetch nearest sensors from backend
- Integrated `weatherApi.getNearestStations()` for real sensor data
- Added loading state with spinner
- Automatically updates app store with fetched sensors
- Supports querying up to 10 nearest stations within 50km radius
- Improved error handling and user feedback

## Backend Endpoints Used

### Air Quality Endpoints

- **GET `/api/v1/air-quality/nearby`** - Get air quality for nearest station based on GPS
  - Query params: `lat`, `lon`, `radius`, `include`
  - Returns: Current and forecast air quality data

- **GET `/api/v1/air-quality/current`** - Get current air quality for all stations
  - Returns: Array of air quality observations

- **GET `/api/v1/air-quality/forecast`** - Get air quality forecast
  - Returns: Array of forecasted air quality data

### Station Endpoints

- **GET `/api/v1/stations`** - Get all weather stations
  - Returns: List of all stations with status

- **GET `/api/v1/stations/nearest`** - Get nearest stations by GPS coordinates
  - Query params: `lat`, `lon`, `limit`, `radius`
  - Returns: Array of nearest stations sorted by distance

## Environment Configuration

The app uses the following environment variable:

```
EXPO_PUBLIC_API_URL=http://192.168.1.234:8000/api/v1
```

Default fallback: `http://localhost:8000/api/v1`

Update the `.env` file with your backend server address.

## Data Flow

### Home Screen (Current Air Quality)

```
User Location (GPS)
    ↓
weatherApi.getEnvironmentData(lat, lon)
    ↓
Backend: /air-quality/nearby
    ↓
Transform & Display
    ↓
UI: Temperature, AQI, Humidity, Wind Speed, etc.
```

### Map Screen (Sensor Locations)

```
User Location (GPS)
    ↓
weatherApi.getNearestStations(lat, lon, limit, radius)
    ↓
Backend: /stations/nearest
    ↓
Display Markers + Info Panel
    ↓
User clicks marker → Show Station Details
```

## Testing Checklist

- [ ] Verify backend URL is correctly set in `.env`
- [ ] Test home screen air quality data loading
- [ ] Test map screen sensor loading and display
- [ ] Test marker selection and info panel display
- [ ] Test error handling (network errors, no data)
- [ ] Test location permission flow
- [ ] Verify AQI color coding matches backend values
- [ ] Test pull-to-refresh on home screen

## Error Handling

The implementation includes:

- Network error handling with retry logic
- Graceful fallbacks for missing data
- Console logging for debugging
- User-friendly loading and error states

## Future Improvements

1. Add real-time WebSocket updates for sensor data
2. Implement caching strategy for offline functionality
3. Add more detailed error messages for users
4. Implement authentication token handling
5. Add pagination for station list
6. Support filtering by station type
7. Add historical data visualization
8. Implement alert notifications based on AQI thresholds
