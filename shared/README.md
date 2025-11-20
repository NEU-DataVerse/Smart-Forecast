# @smart-forecast/shared

Shared TypeScript types, interfaces, and constants for the Smart Forecast platform.

## Overview

This package contains common TypeScript definitions used across all Smart Forecast modules (backend, web, mobile).

## Structure

```
src/
├── types/          # TypeScript interfaces and types
│   ├── auth.types.ts
│   ├── user.types.ts
│   ├── alert.types.ts
│   ├── incident.types.ts
│   ├── airquality.types.ts
│   ├── weather.types.ts
│   ├── geojson.types.ts
│   └── api.types.ts
├── constants/      # Enums and constant values
│   ├── roles.ts
│   ├── incident.ts
│   ├── alert.ts
│   └── status.ts
└── index.ts        # Main entry point
```

## Usage

### In Backend (NestJS)

```typescript
import { UserRole, IUser, IncidentType } from '@smart-forecast/shared';
```

### In Web (Next.js)

```typescript
import { IAlert, AlertLevel, IIncident } from '@smart-forecast/shared';
```

### In Mobile (Expo)

```typescript
import { IncidentStatus, IAuthResponse } from '@smart-forecast/shared';
```

## Development

Build the package:

```bash
pnpm --filter shared run build
```

Watch mode for development:

```bash
pnpm --filter shared run watch
```

## License

MIT - NEU-DataVerse Team
