## WeatherAlert (normalized) for NGSI-LD

```json
{
  "id": "uri:ngsi-ld:WeatherAlert-83b872975414bfca10832e564a1bb416-7",
  "type": "WeatherAlert",
  "address": {
    "type": "Property",
    "value": {
      "addressCountry": "ES",
      "addressRegion": "Huesca"
    }
  },
  "alertSource": {
    "type": "Property",
    "value": "http://www.meteoalarm.eu"
  },
  "category": {
    "type": "Property",
    "value": "weather"
  },
  "dateIssued": {
    "type": "Property",
    "value": {
      "@type": "DateTime",
      "@value": "2016-03-14T13:54:01.00Z"
    }
  },
  "severity": {
    "type": "Property",
    "value": "medium"
  },
  "subCategory": {
    "type": "Property",
    "value": "snow_ice"
  },
  "validFrom": {
    "type": "Property",
    "value": {
      "@type": "DateTime",
      "@value": "2016-03-14T13:00:00.00Z"
    }
  },
  "validTo": {
    "type": "Property",
    "value": {
      "@type": "DateTime",
      "@value": "2016-03-14T23:59:00.00Z"
    }
  },
  "@context": ["https://raw.githubusercontent.com/smart-data-models/dataModel.Weather/master/context.jsonld"]
}
```

## WeatherAlert (keyvalues) for NGSI-LD

```json
{
  "id": "WeatherAlert-83b872975414bfca10832e564a1bb416-7",
  "type": "WeatherAlert",
  "address": {
    "addressCountry": "ES",
    "addressRegion": "Huesca"
  },
  "alertSource": "http://www.meteoalarm.eu",
  "category": "weather",
  "dateIssued": "2016-03-14T13:54:01.00Z",
  "severity": "medium",
  "subCategory": "snow_ice",
  "validFrom": "2016-03-14T13:00:00.00Z",
  "validTo": "2016-03-14T23:59:00.00Z",
  "@context": ["https://raw.githubusercontent.com/smart-data-models/dataModel.Weather/master/context.jsonld"]
}
```
