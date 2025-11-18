# 16 Day Daily Forecast Weather API (OpenWeather)

Get 16-day weather forecast with daily average parameters by geographic coordinates. Data available in JSON or XML.

## API Endpoint

```
GET api.openweathermap.org/data/2.5/forecast/daily?lat={lat}&lon={lon}&cnt={cnt}&appid={API_key}
```

## Parameters

- `lat` (required) — Latitude
- `lon` (required) — Longitude
- `appid` (required) — Your OpenWeather API key
- `cnt` (optional) — Number of days (1-16)
- `mode` (optional) — Format: `json` or `xml` (default `json`)
- `units` (optional) — Units: `standard` (default), `metric`, or `imperial`
- `lang` (optional) — Language code

## Example Request

Call 7-day forecast by geographic coordinates:

```
api.openweathermap.org/data/2.5/forecast/daily?lat=44.34&lon=10.99&cnt=7&appid={API_key}
```

## Example Response (JSON)

```json
{
  "city": {
    "id": 3163858,
    "name": "Zocca",
    "coord": {
      "lon": 10.99,
      "lat": 44.34
    },
    "country": "IT",
    "population": 4593,
    "timezone": 7200
  },
  "cod": "200",
  "message": 0.0582563,
  "cnt": 7,
  "list": [
    {
      "dt": 1661857200,
      "sunrise": 1661834187,
      "sunset": 1661882248,
      "temp": {
        "day": 299.66,
        "min": 288.93,
        "max": 299.66,
        "night": 290.31,
        "eve": 297.16,
        "morn": 288.93
      },
      "feels_like": {
        "day": 299.66,
        "night": 290.3,
        "eve": 297.1,
        "morn": 288.73
      },
      "pressure": 1017,
      "humidity": 44,
      "weather": [
        {
          "id": 500,
          "main": "Rain",
          "description": "light rain",
          "icon": "10d"
        }
      ],
      "speed": 2.7,
      "deg": 209,
      "gust": 3.58,
      "clouds": 53,
      "pop": 0.7,
      "rain": 2.51
    },
    {
      "dt": 1661943600,
      "sunrise": 1661920656,
      "sunset": 1661968542,
      "temp": {
        "day": 295.76,
        "min": 287.73,
        "max": 295.76,
        "night": 289.37,
        "eve": 292.76,
        "morn": 287.73
      },
      "feels_like": {
        "day": 295.64,
        "night": 289.45,
        "eve": 292.97,
        "morn": 287.59
      },
      "pressure": 1014,
      "humidity": 60,
      "weather": [
        {
          "id": 500,
          "main": "Rain",
          "description": "light rain",
          "icon": "10d"
        }
      ],
      "speed": 2.29,
      "deg": 215,
      "gust": 3.27,
      "clouds": 66,
      "pop": 0.82,
      "rain": 5.32
    },
    {
      "dt": 1662030000,
      "sunrise": 1662007126,
      "sunset": 1662054835,
      "temp": {
        "day": 293.38,
        "min": 287.06,
        "max": 293.38,
        "night": 287.06,
        "eve": 289.01,
        "morn": 287.84
      },
      "feels_like": {
        "day": 293.31,
        "night": 287.01,
        "eve": 289.05,
        "morn": 287.85
      },
      "pressure": 1014,
      "humidity": 71,
      "weather": [
        {
          "id": 500,
          "main": "Rain",
          "description": "light rain",
          "icon": "10d"
        }
      ],
      "speed": 2.67,
      "deg": 60,
      "gust": 2.66,
      "clouds": 97,
      "pop": 0.84,
      "rain": 4.49
    }
  ]
}
```

## Response Fields

- `city`
  - `city.id` — City ID (deprecated)
  - `city.name` — City name (deprecated)
  - `city.coord`
    - `lat` — Latitude
    - `lon` — Longitude
  - `country` — Country code (deprecated)
  - `population` — Internal
  - `timezone` — UTC offset (seconds)
- `cod` — Internal
- `message` — Internal
- `cnt` — Number of days returned
- `list` (array)
  - `dt` — Forecast date/time (Unix UTC)
  - `sunrise` — Sunrise time (Unix UTC)
  - `sunset` — Sunset time (Unix UTC)
  - `temp`
    - `day` — Temperature at 12:00 local time
    - `min` — Min daily temperature
    - `max` — Max daily temperature
    - `night` — Temperature at 00:00 local time
    - `eve` — Temperature at 18:00 local time
    - `morn` — Temperature at 06:00 local time
  - `feels_like`
    - `day` — Feels-like at 12:00
    - `night` — Feels-like at 00:00
    - `eve` — Feels-like at 18:00
    - `morn` — Feels-like at 06:00
  - `pressure` — Pressure (hPa)
  - `humidity` — Humidity (%)
  - `weather` (array)
    - `id` — Condition ID
    - `main` — Group (Rain, Snow, Clouds, etc.)
    - `description` — Description (translatable)
    - `icon` — Icon ID
  - `speed` — Max wind speed for the day
  - `deg` — Wind direction (degrees)
  - `gust` — Wind gust
  - `clouds` — Cloudiness (%)
  - `rain` — Precipitation volume (mm)
  - `snow` — Snow volume (mm)
  - `pop` — Probability of precipitation (0-1)

---

References:

- OpenWeather 16 Day Daily Forecast API documentation
