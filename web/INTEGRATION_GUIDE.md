# Web Frontend - Backend Integration Guide

## Overview

The web frontend has been integrated with the backend API services. This document provides information about the implementation.

## Architecture

```
web/src/
├── types/
│   └── dto/                    # Type definitions copied from backend
│       ├── air-quality.dto.ts
│       ├── weather.dto.ts
│       ├── station.dto.ts
│       ├── user.dto.ts
│       └── ingestion.dto.ts
├── lib/
│   ├── api-client.ts          # Generic API request functions
│   └── api-error.ts           # Error handling utilities
├── services/
│   └── api/                   # API service modules
│       ├── air-quality.service.ts
│       ├── weather.service.ts
│       ├── stations.service.ts
│       ├── users.service.ts
│       └── ingestion.service.ts
├── hooks/                     # React hooks with 30-min polling
│   ├── useAirQuality.ts
│   ├── useWeather.ts
│   ├── useStations.ts
│   ├── useUsers.ts
│   └── useIngestion.ts
├── components/
│   ├── admin/
│   │   └── IngestionWidget.tsx    # Admin ingestion monitor
│   └── shared/
│       └── Skeleton.tsx           # Loading skeletons
└── app/
    └── dashboard/
        ├── page.tsx               # Updated with real data
        └── stations/
            └── page.tsx           # Stations management UI
```

## Features Implemented

### 1. Type Definitions (DTOs)

- ✅ Copied all DTOs from backend to `web/src/types/dto/`
- ✅ Converted classes to interfaces
- ✅ Removed class-validator decorators
- ✅ Maintains type safety across frontend

### 2. API Client Infrastructure

- ✅ Generic request functions: `apiGet`, `apiPost`, `apiPut`, `apiDelete`
- ✅ Automatic error handling with toast notifications
- ✅ Success toast notifications for mutations
- ✅ 401 error handling (auto-redirect to login)

### 3. API Services

All backend modules have corresponding frontend services:

#### Air Quality Service

```typescript
airQualityService.getCurrent(params?)      // Current data from Orion-LD
airQualityService.getForecast(params?)     // 4-day forecast
airQualityService.getHistory(params)       // Historical from PostgreSQL
airQualityService.getByStation(stationId)  // Latest by station
```

#### Weather Service

```typescript
weatherService.getCurrent(params?)      // Current weather
weatherService.getForecast(params?)     // 7-day forecast
weatherService.getHistory(params)       // Historical data
weatherService.getByStation(stationId)  // Latest by station
```

#### Stations Service

```typescript
stationsService.list(params?)              // List all stations
stationsService.getActive()                // Active stations only
stationsService.getStats()                 // Statistics
stationsService.getById(id)                // Station details
stationsService.create(data)               // Create new station
stationsService.update(id, data)           // Update station
stationsService.delete(id)                 // Delete station
stationsService.activate(id)               // Activate station
stationsService.deactivate(id)             // Deactivate station
stationsService.batchOperation(data)       // Batch operations
```

#### Users Service

```typescript
usersService.list(); // List all users
usersService.getById(id); // Get user details
```

#### Ingestion Service

```typescript
ingestionService.triggerAll(); // Trigger full ingestion
ingestionService.triggerAirQuality(); // Trigger air quality only
ingestionService.triggerWeather(); // Trigger weather only
ingestionService.getHealth(); // Health check
ingestionService.getStats(); // Statistics
ingestionService.getLocations(); // Monitoring locations
```

### 4. React Hooks with Polling

All hooks implement 30-minute polling:

```typescript
const { data, loading, error, lastUpdate, refetch, stopPolling, startPolling } =
  useAirQuality(options);
```

**Hook Options:**

- `params`: Query parameters for filtering
- `enabled`: Enable/disable polling (default: true)

**Return Values:**

- `data`: Fetched data
- `loading`: Loading state
- `error`: Error object if request failed
- `lastUpdate`: Timestamp of last successful fetch
- `refetch()`: Manually trigger a fetch
- `stopPolling()`: Stop automatic polling
- `startPolling()`: Resume automatic polling

**Polling Behavior:**

- Fetches immediately on mount
- Auto-refreshes every 30 minutes
- Continues polling even if errors occur
- Cleanup on component unmount

### 5. Dashboard Integration

**Dashboard Page** (`/dashboard`):

- ✅ Real-time Air Quality Index display
- ✅ Real-time Temperature display
- ✅ Loading skeletons during data fetch
- ✅ Error states with retry options
- ✅ Last update timestamp
- ✅ Ingestion monitoring widget

**Stations Page** (`/dashboard/stations`):

- ✅ Stations list with filters (city, district, status, priority)
- ✅ Table view with all station details
- ✅ Status and priority badges
- ✅ Pagination ready (backend supports it)
- ✅ Action buttons (edit, delete)
- ✅ Loading states and error handling

### 6. Admin Components

**IngestionWidget**:

- ✅ Service health status display
- ✅ OpenWeatherMap and Orion-LD status
- ✅ Monitoring locations count
- ✅ Manual ingestion trigger button
- ✅ Auto-refresh every 30 minutes
- ✅ Loading and error states

## Usage Examples

### Using API Services Directly

```typescript
import { airQualityService } from '@/services/api';

// Fetch current air quality
const data = await airQualityService.getCurrent({ city: 'Hanoi' });

// Fetch with error handling (toast automatically shown)
try {
  const data = await stationsService.create(newStation);
  // Success toast shown automatically
} catch (error) {
  // Error toast already shown by api-client
  console.error(error);
}
```

### Using Hooks in Components

```typescript
'use client';
import { useAirQuality } from '@/hooks/useAirQuality';

export default function MyComponent() {
  const { data, loading, error, refetch } = useAirQuality({
    params: { city: 'Hanoi' },
    enabled: true,
  });

  if (loading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;

  return (
    <div>
      {data?.data.map(item => (
        <div key={item.id}>AQI: {item.aqi.epaUS.index}</div>
      ))}
    </div>
  );
}
```

### Conditional Polling

```typescript
const [enabled, setEnabled] = useState(true);
const { data, stopPolling, startPolling } = useWeather({ enabled });

// Stop polling when page is inactive
useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.hidden) {
      stopPolling();
    } else {
      startPolling();
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
}, [stopPolling, startPolling]);
```

## Toast Notifications

The API client automatically shows toast notifications:

**Error Toasts** (automatic):

- Network errors
- 400 Bad Request
- 403 Forbidden
- 404 Not Found
- 500 Server Error

**Success Toasts** (for mutations):

- Create operations: "Created successfully"
- Update operations: "Updated successfully"
- Delete operations: "Deleted successfully"
- Custom messages can be provided

**Note**: 401 Unauthorized errors don't show toasts - they trigger automatic redirect to login page.

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## Next Steps

### Recommended Enhancements

1. **Pagination UI**
   - Add pagination controls to stations table
   - Backend already supports `page` and `limit` params

2. **Advanced Filtering**
   - Date range pickers for historical data
   - Multi-select filters for stations

3. **Data Visualization**
   - Charts for air quality trends (using recharts)
   - Weather forecast visualizations
   - Station distribution maps

4. **Real-time Updates**
   - Consider WebSocket for more frequent updates
   - Or reduce polling interval for critical data

5. **Caching Strategy**
   - Implement localStorage caching
   - Add cache invalidation logic

6. **Error Recovery**
   - Add retry logic with exponential backoff
   - Show persistent error banner for repeated failures

7. **Performance Optimization**
   - Implement request deduplication
   - Add loading states optimization (show stale data while refetching)

## Troubleshooting

### Hooks not fetching data

- Check if `enabled` option is set to `true`
- Verify backend is running on correct port
- Check browser console for errors
- Verify `NEXT_PUBLIC_API_URL` is set correctly

### Toast notifications not showing

- Import and add `<Toaster />` component from `sonner` to root layout
- Check if `sonner` package is installed

### Type errors

- Ensure DTOs in `web/src/types/dto/` match backend DTOs
- Run `pnpm install` to ensure all dependencies are installed

### Polling not working

- Check if component is properly mounted
- Verify cleanup function is not called prematurely
- Check browser console for interval errors

## Credits

Implemented on November 24, 2025
Integration follows direct copy approach for simplicity and maintainability.
