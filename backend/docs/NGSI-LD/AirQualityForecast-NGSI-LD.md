## AirQualityForecast (normalized) for NGSI-LD

```json
{
  "id": "urn:ngsi-ld:AirQualityForecast:France-AirQualityForecast-12345_2022-07-01T18:00:00_2022-07-01T00:00:00",
  "type": "AirQualityForecast",
  "address": {
    "type": "Property",
    "value": {
      "addressCountry": "France",
      "postalCode": "06200",
      "addressLocality": "Nice",
      "type": "PostalAddress"
    }
  },
  "location": {
    "type": "GeoProperty",
    "value": {
      "type": "Point",
      "coordinates": [7.2032497427380235, 43.68056738083439]
    }
  },
  "dataProvider": {
    "type": "Property",
    "value": "IMREDD_UCA_Nice"
  },
  "validFrom": {
    "type": "Property",
    "value": {
      "@type": "DateTime",
      "@value": "2022-07-01T17:00:00.00Z"
    }
  },
  "validTo": {
    "type": "Property",
    "value": {
      "@type": "DateTime",
      "@value": "2022-07-01T18:00:00.00Z"
    }
  },
  "validity": {
    "type": "Property",
    "value": "2022-07-01T17:00:00+01:00/2022-07-01T18:00:00+01:00"
  },
  "airQualityIndex": {
    "type": "Property",
    "value": 3
  },
  "airQualityLevel": {
    "type": "Property",
    "value": "moderate"
  },
  "co2": {
    "type": "Property",
    "value": 45,
    "unitCode": "GQ"
  },
  "no2": {
    "type": "Property",
    "value": 69,
    "unitCode": "GQ"
  },
  "o3": {
    "type": "Property",
    "value": 100,
    "unitCode": "GQ"
  },
  "nox": {
    "type": "Property",
    "value": 139,
    "unitCode": "GQ"
  },
  "so2": {
    "type": "Property",
    "value": 11,
    "unitCode": "GQ"
  },
  "pm10": {
    "type": "Property",
    "value": 19,
    "unitCode": "GQ"
  },
  "pm25": {
    "type": "Property",
    "value": 21,
    "unitCode": "GQ"
  },
  "temperature": {
    "type": "Property",
    "value": 12.2
  },
  "relativeHumidity": {
    "type": "Property",
    "value": 0.54
  },
  "windSpeed": {
    "type": "Property",
    "value": 0.64
  },
  "precipitation": {
    "type": "Property",
    "value": 0
  },
  "@context": ["https://raw.githubusercontent.com/smart-data-models/dataModel.Environment/master/context.jsonld"]
}
```

## AirQualityForecast (keyvalues) for NGSI-LD

```json
{
  "id": "urn:ngsi-ld:AirQualityForecast:France-AirQualityForecast-12345_2022-07-01T18:00:00_2022-07-01T00:00:00",
  "type": "AirQualityForecast",
  "address": {
    "addressCountry": "France",
    "addressLocality": "Nice",
    "postalCode": "06200",
    "type": "PostalAddress"
  },
  "airQualityIndex": 3,
  "airQualityLevel": "moderate",
  "co2": 45,
  "dataProvider": "IMREDD_UCA_Nice",
  "location": {
    "coordinates": [7.2032497427380235, 43.68056738083439],
    "type": "Point"
  },
  "no2": 69,
  "nox": 139,
  "o3": 100,
  "pm10": 19,
  "pm25": 21,
  "precipitation": 0,
  "relativeHumidity": 0.54,
  "so2": 11,
  "temperature": 12.2,
  "validFrom": "2022-07-01T17:00:00.00Z",
  "validTo": "2022-07-01T18:00:00.00Z",
  "validity": "2022-07-01T17:00:00+01:00/2022-07-01T18:00:00+01:00",
  "windSpeed": 0.64,
  "@context": ["https://raw.githubusercontent.com/smart-data-models/dataModel.Environment/master/context.jsonld"]
}
```
