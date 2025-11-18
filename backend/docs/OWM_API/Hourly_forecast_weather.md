# Hourly Forecast Weather API (OpenWeather)

Hourly forecast for 4 days (96 hours) by geographic coordinates. Data in JSON or XML.

## API Endpoint

```
GET https://pro.openweathermap.org/data/2.5/forecast/hourly?lat={lat}&lon={lon}&appid={API_key}
```

## Parameters

- `lat` (required) — Latitude
- `lon` (required) — Longitude
- `appid` (required) — Your OpenWeather API key
- `mode` (optional) — Format: `json` or `xml` (default `json`)
- `cnt` (optional) — Number of timestamps
- `lang` (optional) — Language code

## Example Request

```
https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=44.34&lon=10.99&appid={API_key}
```

## Example Response (JSON, excerpt)

```json
{
  "cod": "200",
  "message": 0,
  "cnt": 96,
  "list": [
    {
      "dt": 1661875200,
      "main": {
        "temp": 296.34,
        "feels_like": 296.02,
        "temp_min": 296.34,
        "temp_max": 298.24,
        "pressure": 1015,
        "sea_level": 1015,
        "grnd_level": 933,
        "humidity": 50,
        "temp_kf": -1.9
      },
      "weather": [
        {
          "id": 500,
          "main": "Rain",
          "description": "light rain",
          "icon": "10d"
        }
      ],
      "clouds": {
        "all": 97
      },
      "wind": {
        "speed": 1.06,
        "deg": 66,
        "gust": 2.16
      },
      "visibility": 10000,
      "pop": 0.32,
      "rain": {
        "1h": 0.13
      },
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2022-08-30 16:00:00"
    },
    {
      "dt": 1661878800,
      "main": {
        "temp": 296.31,
        "feels_like": 296.07,
        "temp_min": 296.2,
        "temp_max": 296.31,
        "pressure": 1015,
        "sea_level": 1015,
        "grnd_level": 932,
        "humidity": 53,
        "temp_kf": 0.11
      },
      "weather": [
        {
          "id": 500,
          "main": "Rain",
          "description": "light rain",
          "icon": "10d"
        }
      ],
      "clouds": {
        "all": 95
      },
      "wind": {
        "speed": 1.58,
        "deg": 103,
        "gust": 3.52
      },
      "visibility": 10000,
      "pop": 0.4,
      "rain": {
        "1h": 0.24
      },
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2022-08-30 17:00:00"
    }
  ],
  "city": {
    "id": 3163858,
    "name": "Zocca",
    "coord": {
      "lat": 44.34,
      "lon": 10.99
    },
    "country": "IT",
    "population": 4593,
    "timezone": 7200,
    "sunrise": 1661834187,
    "sunset": 1661882248
  }
}
```

## Response Fields

- `cod` — Internal
- `message` — Internal
- `cnt` — Number of timestamps
- `list` (array)
  - `dt` — Forecast time (Unix UTC)
  - `main`
    - `temp` — Temperature
    - `feels_like` — Feels-like temperature
    - `temp_min` — Min temperature
    - `temp_max` — Max temperature
    - `pressure` — Pressure (hPa)
    - `sea_level` — Sea-level pressure (hPa)
    - `grnd_level` — Ground-level pressure (hPa)
    - `humidity` — Humidity (%)
    - `temp_kf` — Internal
  - `weather` (array)
    - `id` — Condition ID
    - `main` — Group (Rain, Snow, etc.)
    - `description` — Description (translatable)
    - `icon` — Icon ID
  - `clouds`
    - `all` — Cloudiness (%)
  - `wind`
    - `speed` — Wind speed
    - `deg` — Wind direction (degrees)
    - `gust` — Wind gust
  - `rain` (if available)
    - `1h` — Rain volume last 1h (mm)
  - `snow` (if available)
    - `1h` — Snow volume last 1h (mm)
  - `visibility` — Visibility (m, max 10km)
  - `pop` — Probability of precipitation (0-1)
  - `sys`
    - `pod` — Part of day (`n` night, `d` day)
  - `dt_txt` — Forecast time (ISO UTC)
- `city`
  - `id` — City ID (deprecated)
  - `name` — City name (deprecated)
  - `coord`
    - `lat` — Latitude
    - `lon` — Longitude
  - `country` — Country code (deprecated)
  - `population` — Population
  - `timezone` — UTC offset (seconds)
  - `sunrise` — Sunrise time (Unix UTC)
  - `sunset` — Sunset time (Unix UTC)

---

References:

- OpenWeather Hourly Forecast API documentation
