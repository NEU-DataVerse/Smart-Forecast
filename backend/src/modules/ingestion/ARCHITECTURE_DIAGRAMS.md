# 📊 Smart Forecast System Architecture Diagrams

## 1. Tổng Quan Hệ Thống (System Overview)

```mermaid
graph TB
    subgraph "External Services"
        OWM[OpenWeatherMap API<br/>Weather & Air Quality Data]
    end

    subgraph "Smart Forecast Backend"
        API[REST API Layer]

        subgraph "Station Management"
            SM[StationManager<br/>Service]
            SC[Station<br/>Controller]
            SDB[(source_data.json<br/>Station Database)]
        end

        subgraph "Data Ingestion"
            IS[Ingestion<br/>Service]
            SCHEDULER[Cron Scheduler<br/>Every 30 min]
            OWMP[OpenWeatherMap<br/>Provider]
            TRANS[NGSI-LD<br/>Transformer]
        end

        subgraph "Orion Integration"
            OC[Orion Client<br/>Provider]
        end
    end

    subgraph "FIWARE Platform"
        ORION[Orion-LD<br/>Context Broker]
        MONGO[(MongoDB)]
    end

    subgraph "Clients"
        WEB[Web Frontend]
        MOBILE[Mobile App]
        EXTERNAL[External Systems]
    end

    WEB --> API
    MOBILE --> API
    EXTERNAL --> API

    API --> SC
    API --> IS

    SC --> SM
    SM --> SDB

    SCHEDULER --> IS
    IS --> SM
    IS --> OWMP
    OWMP --> OWM

    IS --> TRANS
    TRANS --> OC
    OC --> ORION
    ORION --> MONGO

    style OWM fill:#ff9800
    style SM fill:#4caf50
    style IS fill:#2196f3
    style ORION fill:#9c27b0
```

## 2. Luồng Dữ Liệu Thu Thập (Data Collection Flow)

```mermaid
sequenceDiagram
    participant CRON as Cron Scheduler
    participant IS as Ingestion Service
    participant SM as Station Manager
    participant OWM as OpenWeatherMap API
    participant TRANS as NGSI-LD Transformer
    participant ORION as Orion-LD Broker

    Note over CRON: Every 30 minutes<br/>(:00 and :30)

    CRON->>IS: trigger ingestion
    IS->>SM: findActive()
    SM-->>IS: List of active stations

    loop For each active station
        IS->>OWM: GET current weather
        OWM-->>IS: Weather data (JSON)

        IS->>OWM: GET weather forecast
        OWM-->>IS: 7-day forecast (JSON)

        IS->>OWM: GET air quality
        OWM-->>IS: Air quality data (JSON)

        IS->>OWM: GET air quality forecast
        OWM-->>IS: 4-day forecast (JSON)

        IS->>TRANS: transform to NGSI-LD
        TRANS-->>IS: NGSI-LD entities

        IS->>ORION: upsert entities
        ORION-->>IS: 201 Created
    end

    IS-->>CRON: Ingestion complete<br/>(success/failed counts)
```

## 3. Station Management Flow (Quản Lý Trạm)

```mermaid
graph LR
    subgraph "Admin Actions"
        A1[Create Station]
        A2[Update Station]
        A3[Activate/Deactivate]
        A4[Delete Station]
        A5[Import Stations]
    end

    subgraph "Station Controller"
        SC[REST API<br/>Endpoints]
    end

    subgraph "Station Manager"
        SM[Service Logic]
        CACHE[In-Memory Cache]
    end

    subgraph "Storage"
        JSON[(source_data.json)]
    end

    subgraph "Ingestion Process"
        IS[Ingestion Service]
        SCHEDULER[Cron Job]
    end

    A1 --> SC
    A2 --> SC
    A3 --> SC
    A4 --> SC
    A5 --> SC

    SC --> SM
    SM --> CACHE
    SM --> JSON

    SCHEDULER --> IS
    IS --> SM
    SM -.read active stations.-> IS

    style A3 fill:#4caf50
    style IS fill:#2196f3
    style JSON fill:#ff9800
```

## 4. Station Status Lifecycle (Vòng Đời Trạng Thái)

```mermaid
stateDiagram-v2
    [*] --> Inactive: Create new station<br/>(default status)

    Inactive --> Active: activate()
    Active --> Inactive: deactivate()

    Active --> Maintenance: Set maintenance mode
    Maintenance --> Active: Maintenance complete

    Active --> Retired: Permanent shutdown
    Inactive --> Retired: Permanent shutdown
    Maintenance --> Retired: Permanent shutdown

    Retired --> [*]: Delete station

    note right of Active
        Data collection enabled
        Appears in ingestion
    end note

    note right of Inactive
        Data collection disabled
        Skipped in ingestion
    end note

    note right of Maintenance
        Temporary offline
        Pending repair
    end note

    note right of Retired
        Permanently disabled
        Historical data only
    end note
```

## 5. API Request Flow (Luồng Xử Lý API)

```mermaid
sequenceDiagram
    participant CLIENT as Client/Frontend
    participant API as Station Controller
    participant SM as Station Manager
    participant FILE as source_data.json
    participant IS as Ingestion Service

    rect rgb(200, 255, 200)
        Note over CLIENT,FILE: Scenario 1: Get Active Stations
        CLIENT->>API: GET /stations/active
        API->>SM: findActive()
        SM->>FILE: read data
        FILE-->>SM: all stations
        SM-->>API: filter by status=active
        API-->>CLIENT: 200 OK + active stations
    end

    rect rgb(255, 230, 200)
        Note over CLIENT,FILE: Scenario 2: Create New Station
        CLIENT->>API: POST /stations {data}
        API->>SM: create(dto)
        SM->>SM: generate ID & code
        SM->>FILE: append new station
        FILE-->>SM: write success
        SM-->>API: new station object
        API-->>CLIENT: 201 Created
    end

    rect rgb(200, 230, 255)
        Note over CLIENT,IS: Scenario 3: Deactivate Station
        CLIENT->>API: POST /stations/:id/deactivate
        API->>SM: deactivate(id)
        SM->>FILE: update status=inactive
        FILE-->>SM: save success
        SM-->>API: updated station
        API-->>CLIENT: 200 OK
        Note over IS: Next ingestion cycle<br/>will skip this station
    end
```

## 6. Data Model Relationships (Mối Quan Hệ Dữ Liệu)

```mermaid
erDiagram
    STATION ||--o{ WEATHER_OBSERVED : generates
    STATION ||--o{ WEATHER_FORECAST : generates
    STATION ||--o{ AIR_QUALITY_OBSERVED : generates
    STATION ||--o{ AIR_QUALITY_FORECAST : generates

    STATION {
        string id PK
        string name
        string code
        enum status
        enum priority
        object location
        object address
        array categories
        object metadata
    }

    WEATHER_OBSERVED {
        string id PK
        string stationId FK
        datetime dateObserved
        float temperature
        float humidity
        float pressure
        float windSpeed
        string weatherType
    }

    WEATHER_FORECAST {
        string id PK
        string stationId FK
        datetime validFrom
        datetime validTo
        float temperature
        object dayMaximum
        object dayMinimum
        float precipitationProbability
    }

    AIR_QUALITY_OBSERVED {
        string id PK
        string stationId FK
        datetime dateObserved
        float co
        float no2
        float o3
        float pm25
        float pm10
        int airQualityIndex
    }

    AIR_QUALITY_FORECAST {
        string id PK
        string stationId FK
        datetime validFrom
        datetime validTo
        float co
        float no2
        float pm25
        int airQualityIndex
    }
```

## 7. Component Dependencies (Phụ Thuộc Giữa Các Thành Phần)

```mermaid
graph TD
    subgraph "Core Services"
        SM[StationManager<br/>Service]
        IS[IngestionService]
        OWMP[OpenWeatherMap<br/>Provider]
        OC[OrionClient<br/>Provider]
    end

    subgraph "Controllers"
        SC[StationController]
        IC[IngestionController]
    end

    subgraph "Schedulers"
        CRON[IngestionScheduler]
    end

    subgraph "DTOs"
        SDTO[Station DTOs]
        IDTO[Ingestion DTOs]
    end

    subgraph "Transformers"
        TRANS[NGSI-LD<br/>Transformer]
    end

    SC --> SM
    SC --> SDTO

    IC --> IS
    IC --> IDTO

    CRON --> IS

    IS --> SM
    IS --> OWMP
    IS --> OC
    IS --> TRANS

    SM --> SDTO

    style SM fill:#4caf50,color:#fff
    style IS fill:#2196f3,color:#fff
    style TRANS fill:#ff9800,color:#fff
```

## 8. Deployment Architecture (Kiến Trúc Triển Khai)

```mermaid
graph TB
    subgraph "Docker Network"
        subgraph "Backend Container"
            NEST[NestJS Backend<br/>Port 8000]
            SM[Station Manager]
            IS[Ingestion Service]
            FILE[/source_data.json/]
        end

        subgraph "FIWARE Stack"
            ORION[Orion-LD<br/>Port 1026]
            MONGO[MongoDB<br/>Port 27017]
        end

        subgraph "Frontend"
            WEB[Next.js Web<br/>Port 3000]
            MOBILE[Expo Mobile<br/>Port 8081]
        end
    end

    subgraph "External"
        OWM[OpenWeatherMap<br/>api.openweathermap.org]
        DNS[DNS/Domain]
    end

    DNS --> WEB
    DNS --> MOBILE

    WEB --> NEST
    MOBILE --> NEST

    SM --> FILE
    IS --> SM
    IS --> OWM
    IS --> ORION

    ORION --> MONGO

    style NEST fill:#e91e63
    style ORION fill:#9c27b0
    style OWM fill:#ff9800
```

## 9. Performance & Scaling (Hiệu Năng & Mở Rộng)

```mermaid
graph LR
    subgraph "Current Architecture"
        C1[JSON File Storage]
        C2[In-Memory Cache]
        C3[Single Instance]
    end

    subgraph "Future Scaling Options"
        F1[PostgreSQL/MongoDB]
        F2[Redis Cache]
        F3[Load Balancer]
        F4[Horizontal Scaling]
    end

    subgraph "Performance Metrics"
        M1[Response Time: <100ms]
        M2[Throughput: 1000 req/s]
        M3[Concurrent Users: 10k+]
    end

    C1 -.upgrade.-> F1
    C2 -.upgrade.-> F2
    C3 -.upgrade.-> F3
    C3 -.upgrade.-> F4

    F1 --> M1
    F2 --> M2
    F4 --> M3

    style C1 fill:#ff9800
    style F1 fill:#4caf50
    style M1 fill:#2196f3
```

## 10. Error Handling Flow (Xử Lý Lỗi)

```mermaid
graph TD
    START[Start Ingestion]
    GET_STATIONS[Get Active Stations]
    LOOP[For Each Station]
    FETCH[Fetch OWM Data]
    TRANSFORM[Transform NGSI-LD]
    UPSERT[Upsert to Orion]

    SUCCESS[Log Success]
    ERROR[Log Error]
    CONTINUE[Continue Next Station]
    SUMMARY[Generate Summary]
    END[End Ingestion]

    START --> GET_STATIONS
    GET_STATIONS --> LOOP
    LOOP --> FETCH

    FETCH -->|Success| TRANSFORM
    FETCH -->|API Error| ERROR

    TRANSFORM -->|Success| UPSERT
    TRANSFORM -->|Transform Error| ERROR

    UPSERT -->|Success| SUCCESS
    UPSERT -->|Network Error| ERROR

    SUCCESS --> CONTINUE
    ERROR --> CONTINUE
    CONTINUE --> LOOP

    LOOP -->|All Done| SUMMARY
    SUMMARY --> END

    style SUCCESS fill:#4caf50
    style ERROR fill:#f44336
    style SUMMARY fill:#2196f3
```

## Notes

### Diagram Tools

Các diagram trên sử dụng Mermaid syntax, có thể render trực tiếp trên:

- GitHub README.md
- VS Code với Mermaid extension
- Confluence/Notion/GitLab
- https://mermaid.live/ (online editor)

### Customization

Bạn có thể customize colors, styles bằng cách thêm:

```mermaid
style NodeName fill:#color,stroke:#color,color:#textcolor
```

### Export

Các diagram có thể export sang:

- PNG/SVG (qua mermaid CLI)
- PDF (print từ browser)
- Draw.io format (qua converter)

---

**Version:** 1.0.0  
**Last Updated:** November 21, 2025
