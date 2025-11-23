## WeatherObserved (normalized) for NGSI-LD

```json
{
  "id": "urn:ngsi-ld:WeatherObserved:Spain-WeatherObserved-Valladolid-2016-11-30T07:00:00.00Z",
  "type": "WeatherObserved",
  "address": {
    "type": "Property",
    "value": {
      "addressLocality": "Valladolid",
      "addressCountry": "ES"
    }
  },
  "atmosphericPressure": {
    "type": "Property",
    "value": 938.9
  },
  "dataProvider": {
    "type": "Property",
    "value": "TEF"
  },
  "dateObserved": {
    "type": "Property",
    "value": {
      "@type": "DateTime",
      "@value": "2016-11-30T07:00:00.00Z"
    }
  },
  "illuminance": {
    "type": "Property",
    "value": 1000
  },
  "location": {
    "type": "GeoProperty",
    "value": {
      "type": "Point",
      "coordinates": [-4.754444444, 41.640833333]
    }
  },
  "precipitation": {
    "type": "Property",
    "value": 0
  },
  "pressureTendency": {
    "type": "Property",
    "value": 0.5
  },
  "refDevice": {
    "type": "Relationship",
    "object": "urn:ngsi-ld:Device:device-0A3478"
  },
  "relativeHumidity": {
    "type": "Property",
    "value": 1
  },
  "snowHeight": {
    "type": "Property",
    "value": 20
  },
  "source": {
    "type": "Property",
    "value": "http://www.aemet.es"
  },
  "streamGauge": {
    "type": "Property",
    "value": 50
  },
  "temperature": {
    "type": "Property",
    "value": 3.3
  },
  "uVIndexMax": {
    "type": "Property",
    "value": 1.0
  },
  "windDirection": {
    "type": "Property",
    "value": 135
  },
  "windSpeed": {
    "type": "Property",
    "value": 2
  },
  "@context": ["https://raw.githubusercontent.com/smart-data-models/dataModel.Weather/master/context.jsonld"]
}
```

## WeatherObserved (keyvalues) for NGSI-LD

```json
{
  "id": "urn:ngsi-ld:WeatherObserved:Spain-WeatherObserved-Valladolid-2016-11-30T07:00:00.00Z",
  "type": "WeatherObserved",
  "address": {
    "addressLocality": "Valladolid",
    "addressCountry": "ES"
  },
  "atmosphericPressure": 938.9,
  "dataProvider": "TEF",
  "dateObserved": "2016-11-30T07:00:00.00Z",
  "illuminance": 1000,
  "location": {
    "type": "Point",
    "coordinates": [-4.754444444, 41.640833333]
  },
  "precipitation": 0,
  "pressureTendency": 0.5,
  "refDevice": "urn:ngsi-ld:Device:device-0A3478",
  "relativeHumidity": 1,
  "snowHeight": 20,
  "source": "http://www.aemet.es",
  "streamGauge": 50,
  "temperature": 3.3,
  "uVIndexMax": 1.0,
  "windDirection": 135,
  "windSpeed": 2,
  "@context": ["https://smart-data-models.github.io/dataModel.Weather/context.jsonld", "https://raw.githubusercontent.com/smart-data-models/dataModel.Weather/master/context.jsonld"]
}
```
