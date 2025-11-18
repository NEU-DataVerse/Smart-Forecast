## WeatherForecast (normalized) for NGSI-LD

```json
{
  "id": "Spain-WeatherForecast-46005_2016-12-01T18:00:00_2016-12-02T00:00:00",
  "type": "WeatherForecast",
  "address": {
    "type": "Property",
    "value": {
      "addressCountry": "Spain",
      "postalCode": "46005",
      "addressLocality": "Valencia"
    }
  },
  "dataProvider": {
    "type": "Property",
    "value": "TEF"
  },
  "dateIssued": {
    "type": "Property",
    "value": {
      "@type": "DateTime",
      "@value": "2016-12-01T10:40:01.00Z"
    }
  },
  "dateRetrieved": {
    "type": "Property",
    "value": {
      "@type": "DateTime",
      "@value": "2016-12-01T12:57:24.00Z"
    }
  },
  "dayMaximum": {
    "type": "Property",
    "value": {
      "feelsLikeTemperature": 15,
      "temperature": 15,
      "relativeHumidity": 0.9
    }
  },
  "dayMinimum": {
    "type": "Property",
    "value": {
      "feelsLikeTemperature": 11,
      "temperature": 11,
      "relativeHumidity": 0.7
    }
  },
  "feelsLikeTemperature": {
    "type": "Property",
    "value": 12
  },
  "precipitationProbability": {
    "type": "Property",
    "value": 0.15
  },
  "relativeHumidity": {
    "type": "Property",
    "value": 0.85
  },
  "source": {
    "type": "Property",
    "value": "http://www.aemet.es/xml/municipios/localidad_46250.xml"
  },
  "temperature": {
    "type": "Property",
    "value": 12
  },
  "uVIndexMax": {
    "type": "Property",
    "value": 1.0
  },
  "validFrom": {
    "type": "Property",
    "value": {
      "@type": "DateTime",
      "@value": "2016-12-01T17:00:00.00Z"
    }
  },
  "validTo": {
    "type": "Property",
    "value": {
      "@type": "DateTime",
      "@value": "2016-12-01T23:00:00.00Z"
    }
  },
  "validity": {
    "type": "Property",
    "value": "2016-12-01T18:00:00+01:00/2016-12-02T00:00:00+01:00"
  },
  "weatherType": {
    "type": "Property",
    "value": "overcast"
  },
  "windSpeed": {
    "type": "Property",
    "value": 0.2
  },
  "@context": ["https://raw.githubusercontent.com/smart-data-models/dataModel.Weather/master/context.jsonld"]
}
```

## WeatherForecast (keyvalues) for NGSI-LD

```json
{
  "id": "Spain-WeatherForecast-46005_2016-12-01T18:00:00_2016-12-02T00:00:00",
  "type": "WeatherForecast",
  "address": {
    "addressCountry": "Spain",
    "postalCode": "46005",
    "addressLocality": "Valencia"
  },
  "dataProvider": "TEF",
  "dateIssued": "2016-12-01T10:40:01.00Z",
  "dateRetrieved": "2016-12-01T12:57:24.00Z",
  "dayMaximum": {
    "feelsLikeTemperature": 15,
    "temperature": 15,
    "relativeHumidity": 0.9
  },
  "dayMinimum": {
    "feelsLikeTemperature": 11,
    "temperature": 11,
    "relativeHumidity": 0.7
  },
  "feelsLikeTemperature": 12,
  "precipitationProbability": 0.15,
  "relativeHumidity": 0.85,
  "source": "http://www.aemet.es/xml/municipios/localidad_46250.xml",
  "temperature": 12,
  "validFrom": "2016-12-01T17:00:00.00Z",
  "validTo": "2016-12-01T23:00:00.00Z",
  "validity": "2016-12-01T18:00:00+01:00/2016-12-02T00:00:00+01:00",
  "weatherType": "overcast",
  "windSpeed": 0,
  "uVIndexMax": 1,
  "@context": ["https://raw.githubusercontent.com/smart-data-models/dataModel.Weather/master/context.jsonld"]
}
```
