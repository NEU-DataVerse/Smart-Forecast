# Historical Weather API (OpenWeather)

## API Endpoints

```
GET https://history.openweathermap.org/data/2.5/history/city?lat={lat}&lon={lon}&type=hour&start={start}&end={end}&appid={API_key}
```

```
GET https://history.openweathermap.org/data/2.5/history/city?lat={lat}&lon={lon}&type=hour&start={start}&cnt={cnt}&appid={API_key}
```

## Parameters

- `lat` (required) — Latitude
- `lon` (required) — Longitude
- `type` (required) — Set to `hour`
- `appid` (required) — Your OpenWeather API key
- `start` (optional) — Start date (Unix UTC)
- `end` (optional) — End date (Unix UTC)
- `cnt` (optional) — Number of timestamps (instead of `end`)

## Example Request

```
https://history.openweathermap.org/data/2.5/history/city?lat=41.85&lon=-87.65&appid={API_key}
```

## Example Response (JSON)

```json
{
  "message": "",
  "cod": "200",
  "city_id": 4887398,
  "calctime": 0.0863,
  "cnt": 4,
  "list": [
    {
      "main": {
        "temp": 268.987,
        "temp_min": 268.987,
        "temp_max": 268.987,
        "pressure": 1001.11,
        "sea_level": 1024.68,
        "grnd_level": 1001.11,
        "humidity": 100
      },
      "wind": {
        "speed": 5.06,
        "deg": 291.002
      },
      "clouds": {
        "all": 48
      },
      "weather": [
        {
          "id": 802,
          "main": "Clouds",
          "description": "scattered clouds",
          "icon": "03d"
        }
      ],
      "dt": 1485703465
    },
    {
      "main": {
        "temp": 268.097,
        "temp_min": 268.097,
        "temp_max": 268.097,
        "pressure": 1003.57,
        "sea_level": 1027.08,
        "grnd_level": 1003.57,
        "humidity": 100
      },
      "wind": {
        "speed": 8.56,
        "deg": 314.007
      },
      "clouds": {
        "all": 44
      },
      "weather": [
        {
          "id": 802,
          "main": "Clouds",
          "description": "scattered clouds",
          "icon": "03d"
        }
      ],
      "dt": 1485730032
    },
    {
      "main": {
        "temp": 266.787,
        "temp_min": 266.787,
        "temp_max": 266.787,
        "pressure": 1005.73,
        "sea_level": 1029.63,
        "grnd_level": 1005.73,
        "humidity": 100
      },
      "wind": {
        "speed": 6.79,
        "deg": 316.012
      },
      "clouds": {
        "all": 0
      },
      "weather": [
        {
          "id": 800,
          "main": "Clear",
          "description": "Sky is Clear",
          "icon": "01n"
        }
      ],
      "dt": 1485755383
    },
    {
      "main": {
        "temp": 263.64,
        "pressure": 1015,
        "humidity": 57,
        "temp_min": 262.15,
        "temp_max": 265.15
      },
      "wind": {
        "speed": 2.6,
        "deg": 280
      },
      "clouds": {
        "all": 1
      },
      "weather": [
        {
          "id": 800,
          "main": "Clear",
          "description": "sky is clear",
          "icon": "01n"
        }
      ],
      "dt": 1485780512
    }
  ]
}
```

## Response Fields

- `message` — Internal
- `cod` — Internal
- `city_id` — City ID (deprecated)
- `calctime` — Internal
- `cnt` — Number of items
- `list` (array)
  - `dt` — Data time (Unix UTC)
  - `main`
    - `main.temp` — Temperature
    - `main.feels_like` — Feels-like temperature
    - `main.pressure` — Pressure (hPa)
    - `main.humidity` — Humidity (%)
    - `main.temp_min` — Min temperature
    - `main.temp_max` — Max temperature
    - `main.sea_level` — Sea-level pressure (hPa)
    - `main.grnd_level` — Ground-level pressure (hPa)
  - `wind`
    - `wind.speed` — Wind speed
    - `wind.deg` — Wind direction (degrees)
  - `clouds`
    - `clouds.all` — Cloudiness (%)
  - `rain` (if available)
    - `rain.1h` — Rain volume last 1h (mm)
    - `rain.3h` — Rain volume last 3h (mm)
  - `snow` (if available)
    - `snow.1h` — Snow volume last 1h (mm)
    - `snow.3h` — Snow volume last 3h (mm)
  - `weather` (array)
    - `weather.id` — Condition ID
    - `weather.main` — Group (Rain, Snow, etc.)
    - `weather.description` — Description
    - `weather.icon` — Icon ID

## Notes

- Professional/Expert plans: Max depth is 1 week per response. For more, use multiple queries.

---

References:

- OpenWeather Historical Weather API documentation
