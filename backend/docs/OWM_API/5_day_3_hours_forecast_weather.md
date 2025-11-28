# 🌤️ OpenWeatherMap API: 5-Day / 3-Hour Forecast

## 1. Product Overview

The 5-day forecast is available for any location on the globe. It provides weather forecast data in **3-hour intervals** and is retrievable in **JSON** (default) or **XML** format.

---

## 2. Making an API Request

To retrieve the forecast, send a standard HTTP GET request to the specific endpoint using geographic coordinates.

### Endpoint

```http
[https://api.openweathermap.org/data/2.5/forecast?lat=](https://api.openweathermap.org/data/2.5/forecast?lat=){lat}&lon={lon}&appid={API_key}
```

### Required Parameters

- `lat` (required) — Latitude
- `lon` (required) — Longitude
- `appid` (required) — Your OpenWeather API key
- `mode` (optional) — Response format: `xml`, `html`, or `json` (default)
- `units` (optional) — Units: `standard` (default), `metric`, or `imperial`
- `lang` (optional) — Language code for output

### Example Request

```http
https://api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid={API_key}
```

---

### API Response

```json
{
  "cod": "200",
  "message": 0,
  "cnt": 40,
  "list": [
    {
      "dt": 1661871600,
      "main": {
        "temp": 296.76,
        "feels_like": 296.98,
        "temp_min": 296.76,
        "temp_max": 297.87,
        "pressure": 1015,
        "sea_level": 1015,
        "grnd_level": 933,
        "humidity": 69,
        "temp_kf": -1.11
      },
      "weather": [
        {
          "id": 500,
          "main": "Rain",
          "description": "light rain",
          "icon": "10d"
        }
      ],
      "clouds": { "all": 100 },
      "wind": { "speed": 0.62, "deg": 349, "gust": 1.18 },
      "visibility": 10000,
      "pop": 0.32,
      "rain": { "3h": 0.26 },
      "sys": { "pod": "d" },
      "dt_txt": "2022-08-30 15:00:00"
    }
    /* ... additional 3-hour steps ... */
  ],
  "city": {
    "id": 3163858,
    "name": "Zocca",
    "coord": { "lat": 44.34, "lon": 10.99 },
    "country": "IT",
    "population": 4593,
    "timezone": 7200,
    "sunrise": 1661834187,
    "sunset": 1661882248
  }
}
```

### JSON format API response fields

cod Internal parameter
message Internal parameter
cnt Number of timestamps returned by this API call
list
list.dt Time of data forecasted, Unix, UTC
list.main
list.main.temp Temperature. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit
list.main.feels_like This temperature parameter accounts for the human perception of weather. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit
list.main.temp_min Minimum temperature at the moment of calculation. This is minimal forecasted temperature (within large megalopolises and urban areas), use this parameter optionally. Please find more info here. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit
list.main.temp_max Maximum temperature at the moment of calculation. This is maximal forecasted temperature (within large megalopolises and urban areas), use these parameter optionally. Please find more info here. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit
list.main.pressure Atmospheric pressure on the sea level by default, hPa
list.main.sea_level Atmospheric pressure on the sea level, hPa
list.main.grnd_level Atmospheric pressure on the ground level, hPa
list.main.humidity Humidity, %
list.main.temp_kf Internal parameter
list.weather
list.weather.id Weather condition id
list.weather.main Group of weather parameters (Rain, Snow, Clouds etc.)
list.weather.description Weather condition within the group. Please find more here. You can get the output in your language. Learn more
list.weather.icon Weather icon id
list.clouds
list.clouds.all Cloudiness, %
list.wind
list.wind.speed Wind speed. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour
list.wind.deg Wind direction, degrees (meteorological)
list.wind.gust Wind gust. Units – default: metre/sec, metric: metre/sec, imperial: miles/hour
list.rain
list.rain.1h Rain volume for last hour, mm. Please note that only mm as units of measurement are available for this parameter
list.snow
list.snow.1hSnow volume for last hour, mm. Please note that only mm as units of measurement are available for this parameter
list.visibility Average visibility, metres. The maximum value of the visibility is 10km
list.pop Probability of precipitation. The values of the parameter vary between 0 and 1, where 0 is equal to 0%, 1 is equal to 100%
list.sys
list.sys.pod Part of the day (n - night, d - day)
list.dt_txt Time of data forecasted, ISO, UTC
city
city.id City ID. Please note that built-in geocoder functionality has been deprecated. Learn more here
city.name City name. Please note that built-in geocoder functionality has been deprecated. Learn more here
city.coord
city.coord.lat Geo location, latitude
city.coord.lon Geo location, longitude
countryCountry code (GB, JP etc.). Please note that built-in geocoder functionality has been deprecated. Learn more here
timezone Shift in seconds from UTC
sunrise Sunrise time, Unix, UTC
sunset Sunset time, Unix, UTC
