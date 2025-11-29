'use client';
import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { SearchIcon, DirectionsIcon, CloseIcon } from '@/components/icons';

// Types
interface PlacePrediction {
  place_id: string;
  description: string;
}

interface MapStyle {
  name: string;
  url: string;
}

// Các hằng số cấu hình
const API_CONFIG = {
  URL: 'https://rsapi.goong.io',
  MAP_URL: 'https://tiles.goong.io/assets/',
  API_KEY: 'b7nUCVjr5WoudnWAr3mTdAtT28783RTQR4BBMkHP',
  MAP_KEY: 'YLIkM3eeR8qZK7mNUHv03rn34ltnBgeH3oNOmhHz',
};

const MAP_STYLES = [
  { name: 'Normal', url: `${API_CONFIG.MAP_URL}goong_map_web.json?api_key=${API_CONFIG.MAP_KEY}` },
  {
    name: 'Satellite',
    url: `${API_CONFIG.MAP_URL}goong_satellite.json?api_key=${API_CONFIG.MAP_KEY}`,
  },
  { name: 'Dark', url: `${API_CONFIG.MAP_URL}goong_map_dark.json?api_key=${API_CONFIG.MAP_KEY}` },
  { name: 'Light', url: `${API_CONFIG.MAP_URL}navigation_day.json?api_key=${API_CONFIG.MAP_KEY}` },
  {
    name: 'Night',
    url: `${API_CONFIG.MAP_URL}navigation_night.json?api_key=${API_CONFIG.MAP_KEY}`,
  },
];

const INIT_VIEW = {
  center: [105.85242472181584, 21.029579719995272] as [number, number],
  zoom: 14,
  radius: 500,
};

// Hàm vẽ hình tròn (Helper function)
const drawCircle = (center: Array<number>, radiusInMeters: number) => {
  const points = 64; // Tăng số điểm để tròn mịn hơn
  const coords = { latitude: center[1], longitude: center[0] };
  const km = radiusInMeters / 1000;
  const ret = [];
  const distanceX = km / (111.32 * Math.cos((coords.latitude * Math.PI) / 180));
  const distanceY = km / 110.574;

  for (let i = 0; i < points; i++) {
    const theta = (i / points) * (2 * Math.PI);
    const x = distanceX * Math.cos(theta);
    const y = distanceY * Math.sin(theta);
    ret.push([coords.longitude + x, coords.latitude + y]);
  }
  ret.push(ret[0]);
  return ret;
};

const GoongMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  // State quản lý UI và dữ liệu
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<PlacePrediction[]>([]);

  const [showStylePopover, setShowStylePopover] = useState(false);
  const [currentStyleName, setCurrentStyleName] = useState('Normal');

  const [showDirections, setShowDirections] = useState(false);
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');
  const [startResults, setStartResults] = useState<PlacePrediction[]>([]);
  const [endResults, setEndResults] = useState<PlacePrediction[]>([]);

  // Hàm thêm layer vòng tròn vào map
  const addCircleLayer = (centerCoords: [number, number]) => {
    if (!map.current) return;

    const circleData: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [drawCircle(centerCoords, INIT_VIEW.radius)],
          },
        },
      ],
    };

    const source = map.current.getSource('circle') as maplibregl.GeoJSONSource | undefined;
    if (source) {
      source.setData(circleData);
    } else {
      map.current.addSource('circle', {
        type: 'geojson',
        data: circleData,
      });
      map.current.addLayer({
        id: 'circle',
        type: 'fill',
        source: 'circle',
        paint: {
          'fill-color': '#588888', // Đổi màu giống logic JS cũ khi search
          'fill-opacity': 0.5,
        },
      });
    }
  };

  // Khởi tạo bản đồ
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_STYLES[0].url,
      center: INIT_VIEW.center,
      zoom: INIT_VIEW.zoom,
    });

    map.current.on('load', () => {
      // Vẽ vòng tròn mặc định ban đầu
      addCircleLayer(INIT_VIEW.center);

      if (map.current) {
        new maplibregl.Marker().setLngLat(INIT_VIEW.center).addTo(map.current);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Xử lý AutoComplete
  const fetchAutoComplete = async (
    query: string,
    setResultsCallback: React.Dispatch<React.SetStateAction<PlacePrediction[]>>,
  ) => {
    if (query.length < 2) {
      setResultsCallback([]);
      return;
    }
    try {
      const url = `${API_CONFIG.URL}/Place/AutoComplete?api_key=${API_CONFIG.API_KEY}&input=${encodeURIComponent(query)}`;
      const response = await fetch(url);
      const data = await response.json();
      setResultsCallback(data.predictions || []);
    } catch (error) {
      console.error('Error fetching autocomplete:', error);
      setResultsCallback([]);
    }
  };

  // Xử lý chọn địa điểm
  const handleSelectPlace = async (placeId: string, description: string, isMainSearch = true) => {
    try {
      // 1. Cập nhật UI input
      if (isMainSearch) {
        setSearchText(description);
        setSearchResults([]);
      }

      // 2. Lấy chi tiết địa điểm
      const url = `${API_CONFIG.URL}/Place/Detail?api_key=${API_CONFIG.API_KEY}&place_id=${placeId}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.result && map.current) {
        const { location } = data.result.geometry;
        const lngLat: [number, number] = [location.lng, location.lat];

        // 3. Thêm marker và vẽ vòng tròn
        new maplibregl.Marker().setLngLat(lngLat).addTo(map.current);
        addCircleLayer(lngLat);

        // 4. Di chuyển map
        map.current.flyTo({ center: lngLat, zoom: INIT_VIEW.zoom });
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  // Đổi kiểu bản đồ
  const changeMapStyle = (style: MapStyle) => {
    if (!map.current) return;
    map.current.setStyle(style.url);
    setCurrentStyleName(style.name);
    setShowStylePopover(false);
  };

  return (
    <div className="relative w-full h-screen">
      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* --- Main Search Box --- */}
      {!showDirections && (
        <div className="absolute top-[30px] left-[60px] flex items-center z-10">
          <input
            className="w-[350px] min-h-[40px] px-2 py-0.5 shadow-sm outline-none rounded-l-sm border border-transparent focus:border-blue-300"
            placeholder="Tìm kiếm địa điểm"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              fetchAutoComplete(e.target.value, setSearchResults);
            }}
          />

          <div className="flex items-center justify-center w-[40px] h-[40px] bg-[#fdffff] shadow-sm cursor-pointer">
            <SearchIcon width={20} height={20} className="text-gray-600" />
          </div>

          {/* Button mở chế độ dẫn đường */}
          <div
            className="flex items-center justify-center w-[40px] h-[40px] bg-[#fdffff] shadow-sm rounded-r-sm border-l border-[#cccece] cursor-pointer hover:bg-gray-100"
            onClick={() => setShowDirections(true)}
          >
            <DirectionsIcon width={24} height={24} />
          </div>

          {/* Dropdown kết quả tìm kiếm */}
          {searchResults.length > 0 && (
            <div className="absolute top-[44px] w-[432px] bg-white shadow-md z-20 rounded-sm p-2">
              {searchResults.map((item) => (
                <div
                  key={item.place_id}
                  className="w-full cursor-pointer mb-2 p-1 hover:bg-gray-200 text-sm"
                  onClick={() => handleSelectPlace(item.place_id, item.description)}
                >
                  {item.description}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- Map Style Button & Popover --- */}
      <button
        className="absolute top-[80px] left-[60px] w-[95px] p-2.5 bg-[#f9f9f9] border border-gray-300 cursor-pointer z-10 text-sm font-medium hover:bg-gray-100"
        onClick={() => setShowStylePopover(!showStylePopover)}
      >
        {currentStyleName}
      </button>

      {showStylePopover && (
        <div className="absolute top-[125px] left-[60px] bg-white border border-gray-300 shadow-lg p-2.5 z-50 min-w-[150px]">
          {MAP_STYLES.map((style) => (
            <div
              key={style.name}
              className="p-2.5 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-100 text-sm"
              onClick={() => changeMapStyle(style)}
            >
              {style.name}
            </div>
          ))}
        </div>
      )}

      {/* --- Direction Box --- */}
      {showDirections && (
        <div className="absolute top-[30px] left-[60px] z-10 flex flex-col gap-2 p-4 bg-white/90 rounded shadow-lg">
          <div className="relative">
            <input
              className="w-[350px] h-[40px] px-2 shadow-sm outline-none border rounded-sm focus:border-blue-300 mb-2"
              placeholder="Điểm đầu"
              value={startPoint}
              onChange={(e) => {
                setStartPoint(e.target.value);
                fetchAutoComplete(e.target.value, setStartResults);
              }}
            />
            {/* Start Results */}
            {startResults.length > 0 && (
              <div className="absolute top-[42px] w-[350px] bg-white shadow-md z-30 rounded-sm p-2 max-h-40 overflow-y-auto">
                {startResults.map((item) => (
                  <div
                    key={item.place_id}
                    className="cursor-pointer p-1 hover:bg-gray-200 text-sm truncate"
                    onClick={() => {
                      setStartPoint(item.description);
                      setStartResults([]);
                      // Logic lấy tọa độ điểm đầu có thể thêm ở đây
                    }}
                  >
                    {item.description}
                  </div>
                ))}
              </div>
            )}

            <input
              className="w-[350px] h-[40px] px-2 shadow-sm outline-none border rounded-sm focus:border-blue-300"
              placeholder="Điểm cuối"
              value={endPoint}
              onChange={(e) => {
                setEndPoint(e.target.value);
                fetchAutoComplete(e.target.value, setEndResults);
              }}
            />
            {/* End Results */}
            {endResults.length > 0 && (
              <div className="absolute top-[92px] w-[350px] bg-white shadow-md z-30 rounded-sm p-2 max-h-40 overflow-y-auto">
                {endResults.map((item) => (
                  <div
                    key={item.place_id}
                    className="cursor-pointer p-1 hover:bg-gray-200 text-sm truncate"
                    onClick={() => {
                      setEndPoint(item.description);
                      setEndResults([]);
                      // Logic lấy tọa độ điểm cuối có thể thêm ở đây
                    }}
                  >
                    {item.description}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium">
              Dẫn đường
            </button>
            <button
              className="p-2 hover:bg-gray-200 rounded-full cursor-pointer"
              onClick={() => setShowDirections(false)}
            >
              <CloseIcon width={20} height={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoongMap;
