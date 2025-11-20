/**
 * Station (Weather/Air Quality Monitoring Location)
 * Based on updated source_data.json structure
 */
export interface IStation {
  id: string; // URN format: urn:ngsi-ld:WeatherLocation:hanoi-hoan-kien
  type: string; // "WeatherLocation"
  name: string; // Display name (e.g., "Hồ Hoàn Kiếm")
  city: string; // City name (e.g., "Hanoi")
  district: string; // District name
  location: {
    lat: number;
    lon: number;
  };
  address: {
    addressLocality: string; // District name
    addressCountry: string; // Country code (e.g., "VN")
  };
  timezone: number; // UTC offset in seconds (e.g., 25200 for UTC+7)
}

/**
 * Station query parameters
 */
export interface IStationQueryParams {
  city?: string; // Filter by city
}
