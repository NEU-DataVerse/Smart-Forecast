# Cygnus NGSI-LD Limitation

## Issue

The `fiware/cygnus-ngsi:latest` Docker image **does not support NGSI-LD format**.

### Evidence

1. **Error from Cygnus logs:**

   ```
   WARN | Unknown value: keyValues for NGSI format
   WARN | Unknown value: normalized for NGSI format (implied from previous attempts)
   ```

2. **Root Cause:**
   - Cygnus NGSI handler (`NGSIRestHandler`) only supports NGSI-v2 format
   - NGSI-LD notifications (both `normalized` and `keyValues`) are rejected with HTTP 400
   - The agent is listening on port 5055 but cannot parse NGSI-LD JSON-LD payloads

3. **What We Tested:**
   - ✅ Subscriptions created successfully in Orion-LD
   - ✅ Notifications sent from Orion-LD to Cygnus (confirmed in Orion logs)
   - ✅ Cygnus receiving HTTP requests on port 5055
   - ❌ Cygnus rejecting all NGSI-LD notifications with "Unknown format" error

## Recommended Solutions

### Option 1: Implement Native Persistence Service (RECOMMENDED)

Create a custom NestJS service to handle NGSI-LD subscriptions directly:

```typescript
// backend/src/modules/persistence/persistence.controller.ts
@Controller('notify')
export class PersistenceController {
  @Post()
  async handleNotification(@Body() notification: any) {
    // Parse NGSI-LD normalized format
    // Insert into PostgreSQL with time-series schema
    // Handle both AirQualityObserved and WeatherObserved
  }
}
```

**Advantages:**

- Full control over NGSI-LD parsing and PostgreSQL schema
- Can implement exactly the features we need (partitioning, cleanup, etc.)
- No external dependency on Cygnus
- TypeScript type safety for entity models

**Implementation:**

1. Create `/notify` endpoint in backend to receive Orion-LD notifications
2. Parse NGSI-LD `normalized` format JSON-LD
3. Transform to time-series PostgreSQL schema
4. Reuse existing partition management and cleanup schedulers

### Option 2: Use Orion-LD's Built-in Temporal API (Alternative)

Orion-LD v1.6+ includes built-in temporal data storage in PostgreSQL/TimescaleDB:

```yaml
# docker-compose.yml
orion:
  image: fiware/orion-ld:latest
  environment:
    - ORIONLD_TEMPORAL_STORAGE=postgres
    - ORIONLD_TEMPORAL_POSTGRES_HOST=postgres
```

**Advantages:**

- No custom code needed
- FIWARE-standard temporal API
- Automatic time-series handling

**Disadvantages:**

- Requires Orion-LD >= 1.6
- Less control over schema and retention policies

### Option 3: Switch to Draco (Cygnus Successor for NGSI-LD)

FIWARE Draco is the NGSI-LD-compatible successor to Cygnus:

```yaml
# docker-compose.yml
draco:
  image: ging/fiware-draco:latest
  ports:
    - '5050:5050'
  environment:
    - NIFI_WEB_HTTP_PORT=9090
```

**Note:** Draco is based on Apache NiFi and has a different architecture than Cygnus.

## Current Status

- Module structure completed: ✅
- Subscriptions auto-created: ✅
- Cleanup & partition schedulers: ✅
- **Data persistence**: ❌ Blocked by Cygnus NGSI-LD incompatibility

## Next Steps

Implement Option 1 (Native Persistence Service) as it provides the most control and aligns with our existing NestJS architecture.
