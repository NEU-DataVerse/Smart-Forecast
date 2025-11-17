## AirQualityObserved (normalized) for NGSI-LD

```json
{
  "id": "urn:ngsi-ld:AirQualityObserved:Madrid-AmbientObserved-28079004-2016-03-15T11:00:00",
  "type": "AirQualityObserved",
  "co": {
    "type": "Property",
    "value": 500,
    "unitCode": "GP"
  },
  "coLevel": {
    "type": "Property",
    "value": "moderate"
  },
  "no": {
    "type": "Property",
    "value": 45,
    "unitCode": "GQ"
  },
  "no2": {
    "type": "Property",
    "value": 69,
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
  "address": {
    "type": "Property",
    "value": {
      "addressCountry": "ES",
      "addressLocality": "Madrid",
      "streetAddress": "Plaza de Espa\u00f1a",
      "type": "PostalAddress"
    }
  },
  "airQualityIndex": {
    "type": "Property",
    "value": 65
  },
  "airQualityLevel": {
    "type": "Property",
    "value": "moderate"
  },
  "areaServed": {
    "type": "Property",
    "value": "Brooklands"
  },
  "dateObserved": {
    "type": "Property",
    "value": "2016-03-15T11:00:00"
  },
  "location": {
    "type": "GeoProperty",
    "value": {
      "type": "Point",
      "coordinates": [-3.712247222222222, 40.423852777777775]
    }
  },
  "precipitation": {
    "type": "Property",
    "value": 0
  },
  "refPointOfInterest": {
    "type": "Relationship",
    "object": "urn:ngsi-ld:PointOfInterest:28079004-Pza.deEspanya"
  },
  "relativeHumidity": {
    "type": "Property",
    "value": 0.54
  },
  "reliability": {
    "type": "Property",
    "value": 0.7
  },
  "source": {
    "type": "Property",
    "value": "http://datos.madrid.es"
  },
  "temperature": {
    "type": "Property",
    "value": 12.2
  },
  "typeOfLocation": {
    "type": "Property",
    "value": "outdoor"
  },
  "windDirection": {
    "type": "Property",
    "value": 186
  },
  "windSpeed": {
    "type": "Property",
    "value": 0.64
  },
  "pm4": {
    "type": "Property",
    "value": 37
  },
  "tpc": {
    "type": "Property",
    "value": 108
  },
  "tsp": {
    "type": "Property",
    "value": 73.3
  },
  "pressure": {
    "type": "Property",
    "value": 1.1
  },
  "charge": {
    "type": "Property",
    "value": 5
  },
  "@context": ["https://raw.githubusercontent.com/smart-data-models/dataModel.Environment/master/context.jsonld"]
}
```

## AirQualityObserved (keyvalues) for NGSI-LD

```json
{
  "id": "urn:ngsi-ld:AirQualityObserved:Madrid-AmbientObserved-28079004-2016-03-15T11:00:00",
  "type": "AirQualityObserved",
  "co": 500,
  "coLevel": "moderate",
  "no": 45,
  "no2": 69,
  "nox": 139,
  "so2": 11,
  "address": {
    "addressCountry": "ES",
    "addressLocality": "Madrid",
    "streetAddress": "Plaza de Espa\u00f1a",
    "type": "PostalAddress"
  },
  "airQualityIndex": 65,
  "airQualityLevel": "moderate",
  "areaServed": "Brooklands",
  "dateObserved": "2016-03-15T11:00:00",
  "location": {
    "coordinates": [-3.712247222222222, 40.423852777777775],
    "type": "Point"
  },
  "precipitation": 0,
  "refPointOfInterest": "urn:ngsi-ld:PointOfInterest:28079004-Pza.deEspanya",
  "relativeHumidity": 0.54,
  "reliability": 0.7,
  "source": "http://datos.madrid.es",
  "temperature": 12.2,
  "typeOfLocation": "outdoor",
  "windDirection": 180,
  "windSpeed": 0.64,
  "@context": ["https://raw.githubusercontent.com/smart-data-models/dataModel.Environment/master/context.jsonld"]
}
```
