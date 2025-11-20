# Changelog

All notable changes to the @smart-forecast/shared package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-10

### Added - Initial Release

#### Constants (Enums)

- **User Roles**
  - `UserRole` enum: ADMIN, CITIZEN
  - `SystemRole` enum: SYSTEM
  - `AllRoles` type combining all roles

- **Incident Management**
  - `IncidentType` enum: FLOODING, FALLEN_TREE, LANDSLIDE, AIR_POLLUTION, ROAD_DAMAGE, OTHER
  - `IncidentStatus` enum: PENDING, VERIFIED, REJECTED, IN_PROGRESS, RESOLVED
  - `IncidentTypeLabels` - Vietnamese labels
  - `IncidentStatusLabels` - Vietnamese labels

- **Alert System**
  - `AlertLevel` enum: LOW, MEDIUM, HIGH, CRITICAL
  - `AlertType` enum: WEATHER, AIR_QUALITY, DISASTER, ENVIRONMENTAL
  - `AlertLevelLabels` - Vietnamese labels
  - `AlertLevelColors` - UI color codes

- **API Status**
  - `ApiStatus` enum: SUCCESS, ERROR, PENDING, FAILED
  - `IngestionStatus` enum: SUCCESS, PARTIAL_SUCCESS, FAILED, IN_PROGRESS
  - `UploadStatus` enum: SUCCESS, FAILED, IN_PROGRESS

#### Type Interfaces

- **Authentication & Users** (`auth.types.ts`, `user.types.ts`)
  - `IUser`, `IUserProfile`, `ICreateUser`, `IUpdateUser`
  - `ILoginRequest`, `ILoginResponse`
  - `IRegisterRequest`, `IRegisterResponse`
  - `IJwtPayload`, `IFcmTokenRequest`

- **Alert System** (`alert.types.ts`)
  - `IAlert` - Alert entity
  - `ICreateAlertRequest` - Create alert payload
  - `IAlertQueryParams` - Query filters
  - `IActiveAlert` - Active alerts for citizens

- **Incident Management** (`incident.types.ts`)
  - `IIncident` - Incident entity
  - `ICreateIncidentRequest` - Report incident payload
  - `IUpdateIncidentStatusRequest` - Update status payload
  - `IIncidentQueryParams` - Query filters
  - `IIncidentDetail` - Detailed incident with user info
  - `IActiveIncident` - Active incidents for map
  - `IIncidentSummary` - Statistics summary

- **Environmental Data - NGSI-LD Compliant** (`airquality.types.ts`, `weather.types.ts`)
  - `IAirQualityObserved` - Air quality measurements (PM2.5, PM10, NO2, SO2, CO, O3, AQI)
  - `IAirQualityQueryParams`, `IAirQualityDataPoint`, `IAirQualityStats`
  - `IWeatherObserved` - Weather measurements (temperature, humidity, pressure, wind, precipitation)
  - `IWeatherForecast` - Weather forecast data
  - `IWeatherQueryParams`, `IWeatherDataPoint`, `IWeatherStats`

- **GeoJSON Support** (`geojson.types.ts`)
  - `GeoPoint` - Point geometry (RFC 7946)
  - `GeoPolygon` - Polygon geometry
  - `GeoLineString` - LineString geometry
  - `GeoGeometry` - Union of all geometries
  - `Coordinates` - Simple coordinate pair
  - `Location` - Location with address info

- **API Standards** (`api.types.ts`)
  - `IApiResponse<T>` - Generic response wrapper
  - `IPaginatedResponse<T>` - Paginated data response
  - `IPaginationParams` - Pagination parameters
  - `IFileUploadResponse` - File upload result
  - `IIngestionResponse` - Data ingestion result
  - `IOverviewStats` - Dashboard statistics
  - `IChartData`, `IChartDataset` - Chart visualization data
  - `IDateRangeFilter` - Date range filtering
  - `IErrorResponse` - Error response structure

#### Documentation

- `README.md` - Package overview and structure
- `USAGE.md` - Detailed usage examples for Backend, Web, and Mobile
- `IMPLEMENTATION_SUMMARY.md` - Complete implementation details
- JSDoc comments throughout all interfaces and enums

#### Build Configuration

- TypeScript compilation setup with strict mode
- Declaration file generation (`.d.ts`)
- Source map generation for debugging
- NPM workspace integration

### Technical Details

- **TypeScript Version**: 5.3.3
- **Target**: ES2020
- **Module System**: CommonJS
- **Strict Mode**: Enabled
- **License**: MIT
- **Author**: NEU-DataVerse Team

### Standards Compliance

- ✅ FIWARE Smart Data Models for environmental data
- ✅ NGSI-LD compatibility for context entities
- ✅ RFC 7946 GeoJSON specification
- ✅ RESTful API conventions

### Package Outputs

```
dist/
├── constants/
│   ├── roles.{js,d.ts}
│   ├── incident.{js,d.ts}
│   ├── alert.{js,d.ts}
│   ├── status.{js,d.ts}
│   └── index.{js,d.ts}
├── types/
│   ├── auth.types.{js,d.ts}
│   ├── user.types.{js,d.ts}
│   ├── alert.types.{js,d.ts}
│   ├── incident.types.{js,d.ts}
│   ├── airquality.types.{js,d.ts}
│   ├── weather.types.{js,d.ts}
│   ├── geojson.types.{js,d.ts}
│   ├── api.types.{js,d.ts}
│   └── index.{js,d.ts}
└── index.{js,d.ts}
```

### Usage

```bash
# Build the package
npm run build

# Watch mode for development
npm run watch
```

```typescript
// Import in any workspace package
import { UserRole, IUser, IncidentType, IAlert } from '@smart-forecast/shared';
```

---

**Initial release for OLP'2025 Smart Forecast Platform**
