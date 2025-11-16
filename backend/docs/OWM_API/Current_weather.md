# Current Weather API (OpenWeather)

## API Endpoint

```
GET https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_key}
```

## Parameters

- `lat` (required) — Latitude
- `lon` (required) — Longitude
- `appid` (required) — Your OpenWeather API key
- `mode` (optional) — Response format: `xml`, `html`, or `json` (default)
- `units` (optional) — Units: `standard` (default), `metric`, or `imperial`
- `lang` (optional) — Language code for output

## Example Request

```
https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid={API_key}
```

## Example Response (JSON)

```json
{
  "coord": {
    "lon": 10.99,
    "lat": 44.34
  },
  "weather": [
    {
      "id": 501,
      "main": "Rain",
      "description": "moderate rain",
      "icon": "10d"
    }
  ],
  "base": "stations",
  "main": {
    "temp": 298.48,
    "feels_like": 298.74,
    "temp_min": 297.56,
    "temp_max": 300.05,
    "pressure": 1015,
    "humidity": 64,
    "sea_level": 1015,
    "grnd_level": 933
  },
  "visibility": 10000,
  "wind": {
    "speed": 0.62,
    "deg": 349,
    "gust": 1.18
  },
  "rain": {
    "1h": 3.16
  },
  "clouds": {
    "all": 100
  },
  "dt": 1661870592,
  "sys": {
    "type": 2,
    "id": 2075663,
    "country": "IT",
    "sunrise": 1661834187,
    "sunset": 1661882248
  },
  "timezone": 7200,
  "id": 3163858,
  "name": "Zocca",
  "cod": 200
}
```

## Response Fields

- `coord`
  - `coord.lon` — Longitude
  - `coord.lat` — Latitude
- `weather` (array)
  - `weather.id` — Weather condition ID
  - `weather.main` — Group (Rain, Snow, Clouds, etc.)
  - `weather.description` — Description (translatable)
  - `weather.icon` — Icon ID
- `base` — Internal parameter
- `main`
  - `main.temp` — Temperature (Kelvin default, Celsius metric, Fahrenheit imperial)
  - `main.feels_like` — Feels-like temperature
  - `main.pressure` — Pressure (hPa)
  - `main.humidity` — Humidity (%)
  - `main.temp_min` — Min temperature (current moment)
  - `main.temp_max` — Max temperature (current moment)
  - `main.sea_level` — Sea-level pressure (hPa)
  - `main.grnd_level` — Ground-level pressure (hPa)
- `visibility` — Visibility (m, max 10km)
- `wind`
  - `wind.speed` — Wind speed (m/s default, mph imperial)
  - `wind.deg` — Wind direction (degrees)
  - `wind.gust` — Wind gust
- `clouds`
  - `clouds.all` — Cloudiness (%)
- `rain` (if available)
  - `1h` — Precipitation (mm/h)
- `snow` (if available)
  - `1h` — Precipitation (mm/h)
- `dt` — Data calculation time (Unix UTC)
- `sys`
  - `sys.type` — Internal
  - `sys.id` — Internal
  - `sys.message` — Internal
  - `sys.country` — Country code
  - `sys.sunrise` — Sunrise time (Unix UTC)
  - `sys.sunset` — Sunset time (Unix UTC)
- `timezone` — UTC offset (seconds)
- `id` — City ID (deprecated)
- `name` — City name (deprecated)
- `cod` — Internal

## Notes on Min/Max Temperature

In Current Weather API, `temp_min` and `temp_max` are optional and represent the min/max temperature in the city at the current moment (for reference in large areas). They often match `temp`. Use optionally.

In 16-day forecast, min/max are daily extremes.

Example:

```json
"main": {
  "temp": 306.15,  // current temperature
  "pressure": 1013,
  "humidity": 44,
  "temp_min": 306.15,  // min current in city
  "temp_max": 306.15   // max current in city
}
```

## Units of Measurement

- `standard` (default): Kelvin, m/s, hPa
- `metric`: Celsius, m/s, hPa
- `imperial`: Fahrenheit, mph, hPa

### Examples

**Standard:**

```
https://api.openweathermap.org/data/2.5/weather?lat=57&lon=-2.15&appid={API_key}
```

**Metric:**

```
https://api.openweathermap.org/data/2.5/weather?lat=57&lon=-2.15&appid={API_key}&units=metric
```

**Imperial:**

```
https://api.openweathermap.org/data/2.5/weather?lat=57&lon=-2.15&appid={API_key}&units=imperial
```

## Multilingual Support

Use `lang` parameter for city name and description translation.

```
GET https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_key}&lang={lang}
```

Example:

```
https://api.openweathermap.org/data/2.5/weather?id=524901&lang=vi&appid={API_key}
```

---

References:

- OpenWeather Current Weather API documentation
