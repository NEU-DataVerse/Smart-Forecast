# Cygnus Module - Historical Data Persistence

## 📋 Overview

The Cygnus module manages historical data persistence from Orion-LD Context Broker to PostgreSQL using FIWARE Cygnus. It provides:

- **Automatic NGSI-LD subscriptions** for observed data (AirQualityObserved, WeatherObserved)
- **Forecast cleanup** to remove old forecast entities from Orion-LD
- **PostgreSQL partitioning** for efficient time-series data storage with 24-month retention
- **Management endpoints** for monitoring and administration

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          Data Flow                               │
└─────────────────────────────────────────────────────────────────┘

[Ingestion Service]
        ↓
[Orion-LD Context Broker] ──────┐
        ↓                        │ Subscription Notification
[MongoDB (transient)]            │
                                 ↓
                         [Cygnus:5050/notify]
                                 ↓
                         [PostgreSQL]
                                 ↓
                    [Partitioned Tables by Month]
                         (24-month retention)

┌─────────────────────────────────────────────────────────────────┐
│                     Cleanup & Maintenance                        │
└─────────────────────────────────────────────────────────────────┘

[ForecastCleanupScheduler]     [PartitionManagementScheduler]
   (Daily 2:00 AM)                   (Monthly 1st 1:00 AM)
         ↓                                     ↓
Delete forecasts >14 days            Create future partitions
from Orion-LD                        Drop partitions >24 months
```

## 🚀 Quick Start

### 1. Prerequisites

Ensure Cygnus is running in Docker Compose:

```yaml
# docker-compose.yml
cygnus:
  image: fiware/cygnus-ngsi:latest
  ports:
    - '5080:5080' # API
    - '5050:5050' # Notification endpoint
  environment:
    - CYGNUS_POSTGRESQL_HOST=postgres
    - CYGNUS_POSTGRESQL_DATABASE=smart_forecast_db
```

### 2. Module Registration

The module is automatically registered in `app.module.ts`:

```typescript
import { CygnusModule } from './modules/cygnus/cygnus.module';

@Module({
  imports: [
    // ...
    CygnusModule,
  ],
})
export class AppModule {}
```

### 3. Automatic Initialization

On application startup, the module automatically:

1. ✅ Cleans up stale subscriptions from Orion-LD
2. ✅ Creates subscriptions for `AirQualityObserved` and `WeatherObserved`
3. ✅ Configures notifications to `http://cygnus:5050/notify`

Check logs:

```bash
docker logs backend | grep -i cygnus
# [SubscriptionService] Initializing Cygnus subscriptions...
# [SubscriptionService] ✓ Created subscription for AirQualityObserved: urn:ngsi-ld:Subscription:xxx
# [SubscriptionService] ✓ Created subscription for WeatherObserved: urn:ngsi-ld:Subscription:yyy
```

## 📊 Data Persistence

### Subscribed Entity Types

Only **observed data** is persisted to PostgreSQL:

| Entity Type        | Subscription | Storage            |
| ------------------ | ------------ | ------------------ |
| AirQualityObserved | ✅ Yes       | PostgreSQL         |
| WeatherObserved    | ✅ Yes       | PostgreSQL         |
| AirQualityForecast | ❌ No        | Orion/MongoDB only |
| WeatherForecast    | ❌ No        | Orion/MongoDB only |

### PostgreSQL Tables

Cygnus creates tables with URL-encoded names:

```
x002furn_x003angsi_x002dld_x003aairqualityobserved
x002furn_x003angsi_x002dld_x003aweatherobserved
```

### Table Structure

```sql
-- Cygnus default columns
recvTime      TIMESTAMP     -- Reception timestamp (used for partitioning)
fiwareServicePath TEXT      -- Service path
entityId      TEXT          -- NGSI-LD entity ID
entityType    TEXT          -- Entity type
attrName      TEXT          -- Attribute name
attrType      TEXT          -- Attribute type
attrValue     TEXT          -- Attribute value (JSON)
attrMd        TEXT          -- Attribute metadata (JSON)
```

### Query Examples

```sql
-- Get latest air quality data for a location
SELECT * FROM x002furn_x003angsi_x002dld_x003aairqualityobserved
WHERE entityId = 'urn:ngsi-ld:AirQualityObserved:HoanKiem-21.0285-105.8048'
ORDER BY recvTime DESC
LIMIT 1;

-- Get historical data for date range
SELECT * FROM x002furn_x003angsi_x002dld_x003aweatherobserved
WHERE recvTime BETWEEN '2024-01-01' AND '2024-01-31'
ORDER BY recvTime ASC;

-- Count records by entity
SELECT entityId, COUNT(*) as record_count
FROM x002furn_x003angsi_x002dld_x003aairqualityobserved
GROUP BY entityId;
```

## 🗓️ Partitioning Strategy

### Monthly Partitions

Tables are partitioned by month using `recvTime` column:

```
x002furn_x003angsi_x002dld_x003aairqualityobserved_2024_11  -- Nov 2024
x002furn_x003angsi_x002dld_x003aairqualityobserved_2024_12  -- Dec 2024
x002furn_x003angsi_x002dld_x003aairqualityobserved_2025_01  -- Jan 2025
...
```

### Automatic Management

**PartitionManagementScheduler** runs on the 1st of each month at 1:00 AM:

1. ✅ Creates partitions for next 3 months
2. ✅ Drops partitions older than 24 months
3. ✅ Ensures data retention compliance

### Manual Partition Management

```bash
# Trigger partition management manually
curl -X POST http://localhost:8000/cygnus/partitions/manage

# View partition information
curl http://localhost:8000/cygnus/partitions
```

## 🧹 Forecast Cleanup

### Purpose

Forecast entities (AirQualityForecast, WeatherForecast) are not subscribed to Cygnus, so they accumulate in Orion-LD/MongoDB. The cleanup scheduler removes old forecasts.

### Schedule

**ForecastCleanupScheduler** runs daily at 2:00 AM:

- Retention: **14 days**
- Deletes forecasts older than 14 days from Orion-LD

### Manual Cleanup

```bash
# Trigger forecast cleanup manually
curl -X POST http://localhost:8000/cygnus/cleanup/forecast

# Response:
{
  "success": true,
  "message": "Forecast cleanup completed",
  "deleted": 42,
  "cutoffDate": "2024-11-06T00:00:00.000Z"
}
```

## 🔌 API Endpoints

### Subscription Management

#### `GET /cygnus/subscriptions`

Get all active Cygnus subscriptions.

**Response:**

```json
{
  "success": true,
  "count": 2,
  "subscriptions": [
    {
      "id": "urn:ngsi-ld:Subscription:xxx",
      "type": "Subscription",
      "description": "Cygnus subscription for AirQualityObserved - Auto-created by Smart Forecast",
      "entities": [{ "type": "AirQualityObserved" }],
      "notification": {
        "endpoint": { "uri": "http://cygnus:5050/notify" }
      }
    }
  ]
}
```

#### `POST /cygnus/subscriptions/recreate`

Manually recreate all subscriptions (useful after Orion-LD restart).

**Response:**

```json
{
  "success": true,
  "message": "Subscriptions recreated successfully",
  "deleted": 2,
  "created": 2
}
```

### Health & Monitoring

#### `GET /cygnus/health`

Health check for Cygnus service and subscriptions.

**Response:**

```json
{
  "success": true,
  "healthy": true,
  "cygnus": {
    "healthy": true,
    "endpoint": "http://cygnus:5080"
  },
  "subscriptions": {
    "configured": 2,
    "active": 2,
    "healthy": true
  },
  "timestamp": "2024-11-20T10:30:00.000Z"
}
```

#### `GET /cygnus/stats`

Get statistics about Cygnus and subscriptions.

**Response:**

```json
{
  "success": true,
  "subscriptions": {
    "configured": 2,
    "active": 2,
    "healthy": true
  },
  "cygnus": {
    "version": "2.18.0",
    "uptime": 86400
  },
  "timestamp": "2024-11-20T10:30:00.000Z"
}
```

### Partition Management

#### `GET /cygnus/partitions`

Get partition information for all Cygnus tables.

**Response:**

```json
{
  "success": true,
  "partitions": {
    "x002furn_x003angsi_x002dld_x003aairqualityobserved": {
      "partitions": [
        {
          "partition_name": "x002furn_x003angsi_x002dld_x003aairqualityobserved_2024_11",
          "size": "128 MB"
        }
      ],
      "count": 24
    }
  },
  "timestamp": "2024-11-20T10:30:00.000Z"
}
```

#### `POST /cygnus/partitions/manage`

Manually trigger partition management (create future, drop old).

**Response:**

```json
{
  "success": true,
  "message": "Partition management completed successfully"
}
```

### Cleanup Operations

#### `POST /cygnus/cleanup/forecast`

Manually trigger forecast cleanup from Orion-LD.

**Response:**

```json
{
  "success": true,
  "message": "Forecast cleanup completed",
  "deleted": 42,
  "cutoffDate": "2024-11-06T00:00:00.000Z"
}
```

## 🔧 Configuration

### Environment Variables

```env
# Orion-LD (from ingestion module)
ORION_LD_URL=http://orion:1026

# PostgreSQL (for partition management)
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=admin
DB_PASSWORD=admin
DB_DATABASE=smart_forecast_db

# Cygnus (configured in docker-compose.yml)
CYGNUS_ENDPOINT=http://cygnus:5050/notify
```

### Scheduler Configuration

Modify schedulers in `backend/src/modules/cygnus/schedulers/`:

**ForecastCleanupScheduler:**

```typescript
// Run daily at 2:00 AM
@Cron('0 2 * * *', { timeZone: 'Asia/Ho_Chi_Minh' })

// Retention period
private readonly retentionDays = 14;
```

**PartitionManagementScheduler:**

```typescript
// Run on 1st of month at 1:00 AM
@Cron('0 1 1 * *', { timeZone: 'Asia/Ho_Chi_Minh' })

// Retention period
private readonly retentionMonths = 24;
```

## 🐛 Troubleshooting

### Issue: Subscriptions not created on startup

**Symptoms:**

```
[SubscriptionService] Failed to initialize subscriptions
```

**Solutions:**

1. Check Orion-LD is running:

   ```bash
   curl http://localhost:1026/version
   ```

2. Check network connectivity:

   ```bash
   docker exec backend ping -c 3 orion
   ```

3. Manually recreate subscriptions:
   ```bash
   curl -X POST http://localhost:8000/cygnus/subscriptions/recreate
   ```

### Issue: No data in PostgreSQL

**Symptoms:** Cygnus tables are empty despite data in Orion-LD.

**Solutions:**

1. Check subscriptions exist:

   ```bash
   curl http://localhost:8000/cygnus/subscriptions
   ```

2. Check Cygnus logs:

   ```bash
   docker logs cygnus
   ```

3. Verify Cygnus is receiving notifications:

   ```bash
   docker logs cygnus | grep "notification received"
   ```

4. Manually trigger ingestion to generate new data:
   ```bash
   curl -X POST http://localhost:8000/api/v1/ingestion/all
   ```

### Issue: Partitioning fails

**Symptoms:**

```
[PartitionManagementScheduler] Failed to initialize partitioning
```

**Solutions:**

1. Check if Cygnus has created tables:

   ```sql
   SELECT tablename FROM pg_tables
   WHERE tablename LIKE 'x002furn%';
   ```

2. If tables don't exist, trigger ingestion first:

   ```bash
   curl -X POST http://localhost:8000/api/v1/ingestion/all
   ```

3. Wait for Cygnus to create tables, then manually trigger partition management:
   ```bash
   curl -X POST http://localhost:8000/cygnus/partitions/manage
   ```

### Issue: High storage usage

**Symptoms:** PostgreSQL database growing too large.

**Solutions:**

1. Check partition sizes:

   ```bash
   curl http://localhost:8000/cygnus/partitions
   ```

2. Manually drop old partitions:

   ```bash
   curl -X POST http://localhost:8000/cygnus/partitions/manage
   ```

3. Adjust retention period in `partition-management.scheduler.ts`:
   ```typescript
   private readonly retentionMonths = 12; // Reduce from 24 to 12
   ```

### Issue: Forecast cleanup not working

**Symptoms:** Orion-LD/MongoDB growing with old forecasts.

**Solutions:**

1. Check scheduler logs:

   ```bash
   docker logs backend | grep -i "forecast cleanup"
   ```

2. Manually trigger cleanup:

   ```bash
   curl -X POST http://localhost:8000/cygnus/cleanup/forecast
   ```

3. Verify forecasts are being deleted:
   ```bash
   curl "http://localhost:1026/ngsi-ld/v1/entities?type=AirQualityForecast&limit=1000"
   ```

## 📈 Performance Optimization

### Indexing

Create indexes on Cygnus tables for better query performance:

```sql
-- Index on recvTime (for time-range queries)
CREATE INDEX idx_airquality_recvtime
ON x002furn_x003angsi_x002dld_x003aairqualityobserved(recvTime DESC);

-- Index on entityId (for entity lookup)
CREATE INDEX idx_airquality_entityid
ON x002furn_x003angsi_x002dld_x003aairqualityobserved(entityId);

-- Composite index for common queries
CREATE INDEX idx_airquality_entity_time
ON x002furn_x003angsi_x002dld_x003aairqualityobserved(entityId, recvTime DESC);
```

### Cygnus Configuration

For high-volume scenarios, tune Cygnus batch settings:

```yaml
# docker-compose.yml
cygnus:
  environment:
    - CYGNUS_POSTGRESQL_ENABLE_CACHE=true
    - CYGNUS_POSTGRESQL_BATCH_SIZE=100 # Process 100 notifications at once
    - CYGNUS_POSTGRESQL_BATCH_TIMEOUT=10 # Flush after 10 seconds
```

## 📊 Monitoring

### Key Metrics

Monitor these metrics for production:

1. **Subscription Health:**

   ```bash
   curl http://localhost:8000/cygnus/health | jq '.subscriptions.healthy'
   ```

2. **Partition Count:**

   ```bash
   curl http://localhost:8000/cygnus/partitions | jq '.partitions | map(.count)'
   ```

3. **Storage Size:**

   ```sql
   SELECT
     schemaname,
     tablename,
     pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
   FROM pg_tables
   WHERE tablename LIKE 'x002furn%'
   ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
   ```

4. **Ingestion Rate:**
   ```sql
   SELECT
     DATE(recvTime) as date,
     COUNT(*) as records
   FROM x002furn_x003angsi_x002dld_x003aairqualityobserved
   GROUP BY DATE(recvTime)
   ORDER BY date DESC
   LIMIT 7;
   ```

## 🔐 Security Considerations

1. **Subscription Endpoint:** Currently unprotected. Consider adding authentication in production.

2. **Database Access:** Ensure PostgreSQL credentials are properly secured.

3. **API Endpoints:** Add authentication guards to Cygnus management endpoints:
   ```typescript
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles('admin')
   @Post('partitions/manage')
   ```

## 📚 Related Documentation

- [FIWARE Cygnus Documentation](https://fiware-cygnus.readthedocs.io/)
- [NGSI-LD Specification](https://www.etsi.org/deliver/etsi_gs/CIM/001_099/009/01.06.01_60/gs_CIM009v010601p.pdf)
- [Smart Data Models](https://smartdatamodels.org/)
- [Backend Module Details](../.github/prompts/backend-module-details.md)
- [Stage 2 Epic Plan](.team/STAGE_2.md)

## 🤝 Contributing

When modifying the Cygnus module:

1. Update tests in `cygnus/*.spec.ts`
2. Update this README
3. Test with Docker Compose locally
4. Verify subscriptions are created on startup
5. Test partition management with mock data

---

**Module Status:** ✅ Production Ready

**Last Updated:** November 20, 2024

**Maintainer:** NEU-DataVerse Team
