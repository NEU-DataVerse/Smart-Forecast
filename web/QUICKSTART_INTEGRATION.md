# Quick Start - Backend Integration

## 🚀 Start Using the Integration

### 1. Start Backend Services

```bash
cd backend
pnpm install
pnpm start:dev
```

Backend should be running at `http://localhost:8000`

### 2. Start Web Frontend

```bash
cd web
pnpm install
pnpm dev
```

Web should be running at `http://localhost:3000`

### 3. View Dashboard

Navigate to: `http://localhost:3000/dashboard`

You should see:

- ✅ Real-time Air Quality Index
- ✅ Real-time Temperature
- ✅ Ingestion Service Status
- ✅ Auto-refresh every 30 minutes

### 4. View Stations Management

Navigate to: `http://localhost:3000/dashboard/stations`

You should see:

- ✅ List of all monitoring stations
- ✅ Filters by city, district, status, priority
- ✅ Station details and coordinates

## 🔧 Configuration

Ensure `.env.local` in web folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## 📦 New Imports Available

### Use API Services Directly

```typescript
import { airQualityService, weatherService, stationsService } from '@/services/api';

// Fetch data
const airQuality = await airQualityService.getCurrent();
const weather = await weatherService.getCurrent();
const stations = await stationsService.list();
```

### Use React Hooks (Recommended)

```typescript
'use client';
import { useAirQuality, useWeather, useStations } from '@/hooks';

export default function MyComponent() {
  const { data, loading, error } = useAirQuality();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>AQI: {data?.data[0]?.aqi.epaUS.index}</div>;
}
```

## 🎯 Key Features

| Feature                 | Description                       |
| ----------------------- | --------------------------------- |
| **Auto-polling**        | Data refreshes every 30 minutes   |
| **Toast notifications** | Success/error feedback            |
| **Loading states**      | Skeleton loaders during fetch     |
| **Error handling**      | Automatic retry and user feedback |
| **Type safety**         | Full TypeScript support           |

## 📋 Available Hooks

```typescript
useAirQuality(options); // Air quality data with polling
useWeather(options); // Weather data with polling
useStations(options); // Stations list with polling
useUsers(options); // Users list with polling
useIngestion(options); // Ingestion health & stats with polling
```

## 🛠️ Troubleshooting

**Issue**: Dashboard shows "Failed to load"

- **Fix**: Ensure backend is running on port 8000
- **Check**: `curl http://localhost:8000/api/v1/air-quality/current`

**Issue**: No toast notifications

- **Fix**: Toaster is already in layout, check browser console

**Issue**: Polling not working

- **Fix**: Check browser console for errors
- **Verify**: Component is properly mounted (not in Suspense boundary without fallback)

## 📚 Documentation

- Full guide: `web/INTEGRATION_GUIDE.md`
- Implementation details: `web/IMPLEMENTATION_SUMMARY.md`
- Backend API docs: `backend/BACKEND_README.md`

## ✨ What's Next?

1. Add pagination to stations table
2. Create station edit forms
3. Add data visualization charts
4. Implement historical data views
5. Add export functionality

---

**Note**: Mock data for Reports and Alerts will be replaced once backend modules are implemented.
