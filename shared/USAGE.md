# Usage Examples

## Installation

This package is part of the Smart Forecast monorepo and is automatically linked via pnpm workspaces.

```bash
# Build the shared package
pnpm run build:shared

# Watch mode for development
pnpm run dev:shared
```

## Import Examples

### In Backend (NestJS)

```typescript
// Import specific types and constants
import {
  UserRole,
  IUser,
  ICreateIncidentRequest,
  IncidentType,
  IncidentStatus,
  AlertLevel,
} from '@smart-forecast/shared';

// Use in service
class UserService {
  async createUser(email: string, role: UserRole): Promise<IUser> {
    // Implementation
  }
}

// Use in DTO
class CreateIncidentDto implements ICreateIncidentRequest {
  type: IncidentType;
  description: string;
  location: GeoPoint;
  imageUrls: string[];
}
```

### In Web Frontend (Next.js)

```typescript
// Import types for API responses
import { IAlert, IIncident, IPaginatedResponse, AlertLevel, IncidentStatus } from "@smart-forecast/shared";

// Use in component
interface DashboardProps {
  alerts: IAlert[];
  incidents: IPaginatedResponse<IIncident>;
}

function Dashboard({ alerts, incidents }: DashboardProps) {
  return (
    <div>
      {alerts.map((alert) => (
        <AlertCard key={alert.id} alert={alert} />
      ))}
    </div>
  );
}
```

### In Mobile App (Expo React Native)

```typescript
// Import types for state management
import { IActiveAlert, IActiveIncident, IncidentType, GeoPoint } from '@smart-forecast/shared';

// Use in API service
const reportIncident = async (
  type: IncidentType,
  description: string,
  location: GeoPoint,
  images: string[],
): Promise<IIncident> => {
  const response = await fetch('/api/v1/incident', {
    method: 'POST',
    body: JSON.stringify({ type, description, location, imageUrls: images }),
  });
  return response.json();
};
```

## Available Exports

### Constants (Enums)

- **UserRole**: `ADMIN`, `CITIZEN`
- **IncidentType**: `FLOODING`, `FALLEN_TREE`, `LANDSLIDE`, `AIR_POLLUTION`, `ROAD_DAMAGE`, `OTHER`
- **IncidentStatus**: `PENDING`, `VERIFIED`, `REJECTED`, `IN_PROGRESS`, `RESOLVED`
- **AlertLevel**: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
- **AlertType**: `WEATHER`, `AIR_QUALITY`, `DISASTER`, `ENVIRONMENTAL`
- **ApiStatus**: `SUCCESS`, `ERROR`, `PENDING`, `FAILED`

### Labels & Colors

- **IncidentTypeLabels**: Vietnamese labels for incident types
- **IncidentStatusLabels**: Vietnamese labels for incident status
- **AlertLevelLabels**: Vietnamese labels for alert levels
- **AlertLevelColors**: Color codes for alert levels (for UI)

### Type Interfaces

#### Authentication & Users

- `IUser`, `IUserProfile`, `ICreateUser`, `IUpdateUser`
- `ILoginRequest`, `ILoginResponse`, `IRegisterRequest`, `IRegisterResponse`
- `IJwtPayload`, `IFcmTokenRequest`

#### Alerts

- `IAlert`, `ICreateAlertRequest`, `IAlertQueryParams`, `IActiveAlert`

#### Incidents

- `IIncident`, `ICreateIncidentRequest`, `IUpdateIncidentStatusRequest`
- `IIncidentQueryParams`, `IIncidentDetail`, `IActiveIncident`, `IIncidentSummary`

#### Environmental Data (NGSI-LD)

- `IAirQualityObserved`, `IAirQualityQueryParams`, `IAirQualityDataPoint`, `IAirQualityStats`
- `IWeatherObserved`, `IWeatherForecast`, `IWeatherQueryParams`, `IWeatherDataPoint`, `IWeatherStats`

#### GeoJSON

- `GeoPoint`, `GeoPolygon`, `GeoLineString`, `GeoGeometry`
- `Coordinates`, `Location`

#### API Responses

- `IApiResponse<T>`, `IPaginatedResponse<T>`, `IPaginationParams`
- `IFileUploadResponse`, `IIngestionResponse`, `IOverviewStats`
- `IChartData`, `IChartDataset`, `IDateRangeFilter`, `IErrorResponse`

## Type Safety Benefits

✅ **Consistency**: Same types across backend, web, and mobile  
✅ **Auto-completion**: Full IntelliSense support in all modules  
✅ **Compile-time checks**: Catch type errors before runtime  
✅ **Refactoring**: Change once, update everywhere  
✅ **Documentation**: Types serve as living documentation

## Development Workflow

1. **Make changes** to shared types/constants
2. **Rebuild** the package: `pnpm run build:shared`
3. The changes will be **automatically available** in all workspace packages
4. TypeScript will show **errors immediately** if breaking changes are introduced

## Best Practices

- ✅ Always use interfaces from shared for API contracts
- ✅ Use enums instead of string literals for constant values
- ✅ Keep the shared package focused on types and constants only
- ✅ Document complex types with JSDoc comments
- ❌ Don't add runtime code or utilities (only types and constants)
- ❌ Don't import external dependencies (keep it lightweight)
