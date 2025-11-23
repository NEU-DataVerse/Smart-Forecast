'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Radio, MapPin, Plus, Edit2, Trash2, Wifi } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

interface IoTStation {
  id: string;
  name: string;
  deviceId: string;
  location: {
    city: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  status: 'online' | 'offline' | 'maintenance';
  sensors: string[];
  lastUpdate: string;
  dataInterval: number; // in minutes
}

export default function Settings() {
  const [isStationDialogOpen, setIsStationDialogOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<IoTStation | null>(null);
  const [iotStations, setIotStations] = useState<IoTStation[]>([
    {
      id: '1',
      name: 'Downtown Weather Station',
      deviceId: 'WS-DT-001',
      location: {
        city: 'Los Angeles',
        coordinates: { lat: 34.0522, lng: -118.2437 },
      },
      status: 'online',
      sensors: ['temperature', 'humidity', 'pressure', 'wind', 'precipitation'],
      lastUpdate: '2 mins ago',
      dataInterval: 5,
    },
    {
      id: '2',
      name: 'North District Monitor',
      deviceId: 'WS-ND-002',
      location: {
        city: 'Los Angeles',
        coordinates: { lat: 34.09, lng: -118.3617 },
      },
      status: 'online',
      sensors: ['temperature', 'humidity', 'aqi', 'uv'],
      lastUpdate: '5 mins ago',
      dataInterval: 10,
    },
    {
      id: '3',
      name: 'Coastal Weather Hub',
      deviceId: 'WS-CH-003',
      location: {
        city: 'San Diego',
        coordinates: { lat: 32.7157, lng: -117.1611 },
      },
      status: 'maintenance',
      sensors: ['temperature', 'humidity', 'wind', 'pressure'],
      lastUpdate: '2 hours ago',
      dataInterval: 15,
    },
  ]);

  const [stationFormData, setStationFormData] = useState({
    name: '',
    deviceId: '',
    city: '',
    lat: '',
    lng: '',
    dataInterval: '10',
    sensors: [] as string[],
  });

  const availableSensors = [
    { id: 'temperature', label: 'Temperature' },
    { id: 'humidity', label: 'Humidity' },
    { id: 'pressure', label: 'Barometric Pressure' },
    { id: 'wind', label: 'Wind Speed & Direction' },
    { id: 'precipitation', label: 'Precipitation' },
    { id: 'aqi', label: 'Air Quality Index' },
    { id: 'uv', label: 'UV Index' },
    { id: 'visibility', label: 'Visibility' },
  ];

  const resetStationForm = () => {
    setStationFormData({
      name: '',
      deviceId: '',
      city: '',
      lat: '',
      lng: '',
      dataInterval: '10',
      sensors: [],
    });
    setEditingStation(null);
  };

  const handleOpenStationDialog = (station?: IoTStation) => {
    if (station) {
      setEditingStation(station);
      setStationFormData({
        name: station.name,
        deviceId: station.deviceId,
        city: station.location.city,
        lat: station.location.coordinates.lat.toString(),
        lng: station.location.coordinates.lng.toString(),
        dataInterval: station.dataInterval.toString(),
        sensors: station.sensors,
      });
    } else {
      resetStationForm();
    }
    setIsStationDialogOpen(true);
  };

  const handleSaveStation = () => {
    if (editingStation) {
      // Update existing station
      setIotStations(
        iotStations.map((station) =>
          station.id === editingStation.id
            ? {
                ...station,
                name: stationFormData.name,
                deviceId: stationFormData.deviceId,
                location: {
                  city: stationFormData.city,
                  coordinates: {
                    lat: parseFloat(stationFormData.lat),
                    lng: parseFloat(stationFormData.lng),
                  },
                },
                dataInterval: parseInt(stationFormData.dataInterval),
                sensors: stationFormData.sensors,
              }
            : station,
        ),
      );
    } else {
      // Add new station
      const newStation: IoTStation = {
        id: (iotStations.length + 1).toString(),
        name: stationFormData.name,
        deviceId: stationFormData.deviceId,
        location: {
          city: stationFormData.city,
          coordinates: {
            lat: parseFloat(stationFormData.lat),
            lng: parseFloat(stationFormData.lng),
          },
        },
        status: 'online',
        sensors: stationFormData.sensors,
        lastUpdate: 'Just now',
        dataInterval: parseInt(stationFormData.dataInterval),
      };
      setIotStations([...iotStations, newStation]);
    }
    setIsStationDialogOpen(false);
    resetStationForm();
  };

  const handleDeleteStation = (stationId: string) => {
    setIotStations(iotStations.filter((station) => station.id !== stationId));
  };

  const toggleSensor = (sensorId: string) => {
    setStationFormData((prev) => ({
      ...prev,
      sensors: prev.sensors.includes(sensorId)
        ? prev.sensors.filter((s) => s !== sensorId)
        : [...prev.sensors, sensorId],
    }));
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'online':
        return 'default';
      case 'offline':
        return 'destructive';
      case 'maintenance':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-slate-900">System Settings</h2>
        <p className="text-slate-500">Configure API keys and data sources</p>
      </div>

      {/* IoT Stations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>IoT Weather Stations</CardTitle>
              <CardDescription>
                Manage and configure IoT weather data collection stations
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenStationDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Station
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {iotStations.map((station) => (
              <Card key={station.id} className="bg-slate-50 border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="bg-white p-3 rounded-lg">
                        <Radio className="h-6 w-6 text-blue-500" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-slate-900">{station.name}</h4>
                            <Badge variant={getStatusBadgeVariant(station.status)}>
                              {station.status}
                            </Badge>
                          </div>
                          <p className="text-slate-500">{station.deviceId}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2 text-slate-600">
                            <MapPin className="h-4 w-4" />
                            <span>{station.location.city}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <Wifi className="h-4 w-4" />
                            <span>Every {station.dataInterval} min</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <p className="text-slate-500">Sensors:</p>
                          <div className="flex flex-wrap gap-1">
                            {station.sensors.map((sensor) => (
                              <Badge key={sensor} variant="outline" className="text-xs">
                                {sensor}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="text-slate-500">Last update: {station.lastUpdate}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenStationDialog(station)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteStation(station.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Station Dialog */}
      <Dialog open={isStationDialogOpen} onOpenChange={setIsStationDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingStation ? 'Edit Station' : 'Add New Station'}</DialogTitle>
            <DialogDescription>
              {editingStation ? 'Update station details' : 'Enter station details'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                type="text"
                value={stationFormData.name}
                onChange={(e) => setStationFormData({ ...stationFormData, name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div className="space-y-2">
              <Label>Device ID</Label>
              <Input
                type="text"
                value={stationFormData.deviceId}
                onChange={(e) =>
                  setStationFormData({ ...stationFormData, deviceId: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div className="space-y-2">
              <Label>City</Label>
              <Input
                type="text"
                value={stationFormData.city}
                onChange={(e) => setStationFormData({ ...stationFormData, city: e.target.value })}
                className="mt-1"
              />
            </div>
            <div className="space-y-2">
              <Label>Latitude</Label>
              <Input
                type="text"
                value={stationFormData.lat}
                onChange={(e) => setStationFormData({ ...stationFormData, lat: e.target.value })}
                className="mt-1"
              />
            </div>
            <div className="space-y-2">
              <Label>Longitude</Label>
              <Input
                type="text"
                value={stationFormData.lng}
                onChange={(e) => setStationFormData({ ...stationFormData, lng: e.target.value })}
                className="mt-1"
              />
            </div>
            <div className="space-y-2">
              <Label>Data Interval (minutes)</Label>
              <Input
                type="number"
                value={stationFormData.dataInterval}
                onChange={(e) =>
                  setStationFormData({ ...stationFormData, dataInterval: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div className="space-y-2">
              <Label>Sensors</Label>
              <div className="space-y-1">
                {availableSensors.map((sensor) => (
                  <div key={sensor.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={sensor.id}
                      checked={stationFormData.sensors.includes(sensor.id)}
                      onCheckedChange={() => toggleSensor(sensor.id)}
                    />
                    <label htmlFor={sensor.id} className="text-slate-700 cursor-pointer">
                      {sensor.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsStationDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveStation}>
              {editingStation ? 'Update Station' : 'Add Station'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
