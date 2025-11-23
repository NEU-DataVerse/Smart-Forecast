# Weather Observed Persistence Issue - Root Cause Analysis

## Problem Summary

**Issue:** `WeatherObserved` entities are NOT being persisted to PostgreSQL, while `AirQualityObserved` entities work correctly.

**Database Check:**

```sql
-- Result from PostgreSQL query:
-- air_quality_observed: 5 records ✓
-- weather_observed: 0 records ✗
```

## Root Cause

### Incorrect Subscription Context

In `backend/src/modules/persistence/services/subscription.service.ts`, the subscription creation was using the **wrong context** for `WeatherObserved` entities.

**Before (Incorrect):**

```typescript
private async createSubscription(entityType: string): Promise<string> {
  const subscription = {
    '@context': [
      'https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld',
      'https://raw.githubusercontent.com/smart-data-models/dataModel.Environment/master/context.jsonld', // ❌ WRONG!
    ],
    // ... rest of subscription
  };
}
```

### Why This Failed

1. **AirQualityObserved** belongs to `dataModel.Environment` ✓
2. **WeatherObserved** belongs to `dataModel.Weather` ✗ (was using wrong context)

The context URL `dataModel.Environment/master/context.jsonld` does NOT define `WeatherObserved` type, causing the subscription to fail silently.

## Solution Implemented

### 1. Fixed Subscription Service Code

**File:** `backend/src/modules/persistence/services/subscription.service.ts`

```typescript
private async createSubscription(entityType: string): Promise<string> {
  // Use appropriate context based on entity type
  const contextUrl =
    entityType === 'AirQualityObserved'
      ? 'https://raw.githubusercontent.com/smart-data-models/dataModel.Environment/master/context.jsonld'
      : 'https://raw.githubusercontent.com/smart-data-models/dataModel.Weather/master/context.jsonld';

  const subscription = {
    '@context': [
      'https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld',
      contextUrl, // ✓ Correct context per entity type
    ],
    // ... rest of subscription
  };
}
```

### 2. Enhanced Logging for Debugging

**File:** `backend/src/modules/persistence/services/persistence.service.ts`

Added detailed logging to track entity processing:

```typescript
async persistEntities(entities: any[], notifiedAt: string) {
  // Log entities received
  this.logger.debug(
    `Received ${entities.length} entities to persist at ${notifiedAt}`,
  );

  for (const entity of entities) {
    this.logger.debug(
      `Processing entity: ${entity.id}, type: ${entity.type}`,
    );
    // ...
  }
}

private async persistEntity(entity: any, notifiedAt: string) {
  const entityType = this.extractEntityType(entity.type);

  this.logger.debug(
    `Processing entity ${entity.id} with type: ${entity.type} -> extracted: ${entityType}`,
  );
  // ...
}
```

### 3. Created Fix Script

**File:** `scripts/fix-weather-subscription.sh`

This script:

- Deletes the old incorrect WeatherObserved subscription
- Creates a new subscription with the correct context
- Verifies the fix

**Execution result:**

```bash
✓ Found WeatherObserved subscription: urn:ngsi-ld:Subscription:ff59d7d2-c7ab-11f0-8389-bee6e93be0f0
✓ Successfully deleted old subscription
✓ Successfully created new subscription
```

## Verification Steps

### Step 1: Check Current State

```bash
# Check subscriptions
curl http://localhost:1026/ngsi-ld/v1/subscriptions

# Check database
docker exec -it postgres psql -U admin -d smart_forecast_db \
  -c "SELECT COUNT(*) FROM weather_observed;"
```

### Step 2: Test the Fix (Backend must be running)

```bash
# Trigger weather data ingestion
curl -X POST http://localhost:8000/api/v1/ingestion/weather

# Wait a few seconds for notification processing
sleep 5

# Verify persistence
docker exec -it postgres psql -U admin -d smart_forecast_db \
  -c "SELECT entity_id, temperature, recv_time FROM weather_observed ORDER BY recv_time DESC LIMIT 5;"
```

### Step 3: Manual Test (Optional)

Use `scripts/test-weather-persistence.sh` to create a test entity and verify persistence.

## Files Modified

1. ✅ `backend/src/modules/persistence/services/subscription.service.ts` - Fixed context selection
2. ✅ `backend/src/modules/persistence/services/persistence.service.ts` - Enhanced logging
3. ✅ `scripts/fix-weather-subscription.sh` - Created fix script
4. ✅ `scripts/check-orion-data.sh` - Created diagnostic script
5. ✅ `scripts/test-weather-persistence.sh` - Created test script

## Next Actions Required

1. **Restart Backend Service** (if running) to load new code:

   ```bash
   cd backend
   npm run start:dev
   ```

2. **Trigger Weather Ingestion:**

   ```bash
   curl -X POST http://localhost:8000/api/v1/ingestion/weather
   ```

3. **Verify Persistence:**

   ```bash
   docker exec -it postgres psql -U admin -d smart_forecast_db \
     -c "SELECT COUNT(*), 'weather' as table FROM weather_observed
         UNION ALL
         SELECT COUNT(*), 'air_quality' FROM air_quality_observed;"
   ```

4. **Monitor Logs:**
   - Check backend logs for: `"Processing entity: ... type: WeatherObserved"`
   - Check for: `"Persisted Weather: urn:ngsi-ld:WeatherObserved:..."`

## Expected Outcome

After implementing this fix and restarting backend:

- ✅ WeatherObserved entities will be persisted to PostgreSQL
- ✅ Both AirQualityObserved and WeatherObserved will work correctly
- ✅ Enhanced logging will help debug any future issues

## Technical Details

### Smart Data Models Contexts

| Entity Type        | Data Model            | Context URL                                       |
| ------------------ | --------------------- | ------------------------------------------------- |
| AirQualityObserved | dataModel.Environment | `.../dataModel.Environment/master/context.jsonld` |
| WeatherObserved    | dataModel.Weather     | `.../dataModel.Weather/master/context.jsonld`     |
| AirQualityForecast | dataModel.Environment | `.../dataModel.Environment/master/context.jsonld` |
| WeatherForecast    | dataModel.Weather     | `.../dataModel.Weather/master/context.jsonld`     |

### NGSI-LD Subscription Matching

For Orion-LD to match entities with subscriptions:

1. Entity `type` must match subscription `entities[].type`
2. Entity must be defined in subscription `@context`
3. Both conditions MUST be satisfied

**Why it failed:**

- Subscription type: `WeatherObserved` ✓
- Subscription context: `dataModel.Environment` ✗
- Result: No match, no notification sent

## Conclusion

The issue was caused by using an incorrect NGSI-LD context URL in the subscription service. The fix ensures each entity type uses its appropriate context definition, allowing Orion-LD to properly match entities with subscriptions and trigger notifications to the persistence service.
