# Air Pollution API (OpenWeather)

Air Pollution API provides current, forecast and historical air pollution data for any coordinates on the globe.

Besides the Air Quality Index (AQI), the API returns concentrations for gases and particulates: Carbon monoxide (CO), Nitrogen monoxide (NO), Nitrogen dioxide (NO2), Ozone (O3), Sulphur dioxide (SO2), Ammonia (NH3), PM2.5 and PM10.

Forecasts: 4 days with hourly granularity.
Historical data: available from 2020-11-27.

## AQI scale (OpenWeather)

| Qualitative name | Index | SO2 (μg/m3) | NO2 (μg/m3) | PM10 (μg/m3) | PM2.5 (μg/m3) | O3 (μg/m3) |   CO (μg/m3)   |
| :--------------- | :---: | :---------: | :---------: | :----------: | :-----------: | :--------: | :------------: |
| Good             |   1   |   [0, 20)   |   [0, 40)   |   [0, 20)    |    [0, 10)    |  [0, 60)   |   [0, 4400)    |
| Fair             |   2   |  [20, 80)   |  [40, 70)   |   [20, 50)   |   [10, 25)    | [60, 100)  |  [4400, 9400)  |
| Moderate         |   3   |  [80, 250)  |  [70, 150)  |  [50, 100)   |   [25, 50)    | [100, 140) | [9400, 12400)  |
| Poor             |   4   | [250, 350)  | [150, 200)  |  [100, 200)  |   [50, 75)    | [140, 180) | [12400, 15400) |
| Very Poor        |   5   |    ≥350     |    ≥200     |     ≥200     |      ≥75      |    ≥180    |     ≥15400     |

Other reported parameters that do not affect AQI calculation:

- `NH3`: typical range 0.1 — 200 μg/m3
- `NO`: typical range 0.1 — 100 μg/m3

---

## Current air pollution

API endpoint:

```
GET http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API_key}
```

Required parameters:

- `lat` — latitude
- `lon` — longitude
- `appid` — your OpenWeather API key

Example request:

```
http://api.openweathermap.org/data/2.5/air_pollution?lat=50&lon=50&appid={API_key}
```

Example response (current):

```json
{
  "coord": [50.0, 50.0],
  "list": [
    {
      "dt": 1606147200,
      "main": { "aqi": 4 },
      "components": {
        "co": 203.609,
        "no": 0.0,
        "no2": 0.396,
        "o3": 75.102,
        "so2": 0.648,
        "pm2_5": 23.253,
        "pm10": 92.214,
        "nh3": 0.117
      }
    }
  ]
}
```

---

## Forecast air pollution

API endpoint:

```
GET http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat={lat}&lon={lon}&appid={API_key}
```

Example request:

```
http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=50&lon=50&appid={API_key}
```

Example response (excerpt):

```json
{
  "coord": [50.0, 50.0],
  "list": [
    {
      "dt": 1605916800,
      "main": { "aqi": 1 },
      "components": {
        "co": 211.954,
        "no": 0.0,
        "no2": 0.217,
        "o3": 72.956,
        "so2": 0.514,
        "pm2_5": 2.563,
        "pm10": 5.757,
        "nh3": 0.216
      }
    },
    {
      "dt": 1605920400,
      "main": { "aqi": 1 },
      "components": {
        /* ... */
      }
    }
  ]
}
```

---

## Historical air pollution

API endpoint:

```
GET http://api.openweathermap.org/data/2.5/air_pollution/history?lat={lat}&lon={lon}&start={start}&end={end}&appid={API_key}
```

Required parameters:

- `start` — Unix start timestamp (UTC)
- `end` — Unix end timestamp (UTC)

Example request:

```
http://api.openweathermap.org/data/2.5/air_pollution/history?lat=50&lon=50&start=1606223802&end=1606482999&appid={API_key}
```

Example response (excerpt):

```json
{
  "coord": [50.0, 50.0],
  "list": [
    {
      "dt": 1606482000,
      "main": { "aqi": 2 },
      "components": {
        "co": 270.367,
        "no": 5.867,
        "no2": 43.184,
        "o3": 4.783,
        "so2": 14.544,
        "pm2_5": 13.448,
        "pm10": 15.524,
        "nh3": 0.289
      }
    }
  ]
}
```

---

## Fields in API response

- `coord` — Coordinates for the request (latitude, longitude)
- `list` — Array of measurements
  - `dt` — Unix timestamp (UTC)
  - `main.aqi` — Air Quality Index (1–5): 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor
  - `components` — Pollutant concentrations (μg/m3):
    - `co` — Carbon monoxide
    - `no` — Nitrogen monoxide
    - `no2` — Nitrogen dioxide
    - `o3` — Ozone
    - `so2` — Sulphur dioxide
    - `pm2_5` — PM2.5 (fine particulate matter)
    - `pm10` — PM10 (coarse particulate matter)
    - `nh3` — Ammonia

If you need AQI according to another scale (UK, EU, US, China), recalculate using the appropriate conversion tables.

---

References:

- OpenWeather Air Pollution API documentation
