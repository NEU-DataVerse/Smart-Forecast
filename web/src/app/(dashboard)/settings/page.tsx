'use client';

import { useState, useEffect } from 'react';
import { useStations } from '@/hooks/useStations';
import {
  StationStatistics,
  StationList,
  StationDialog,
  type StationFormData,
} from '@/components/settings';
import type {
  ObservationStation,
  CreateStationDto,
  UpdateStationDto,
  StationStatsResponse,
  StationQueryParams,
  StationPriority,
} from '@/types/dto';

export default function Settings() {
  const [queryParams, setQueryParams] = useState<StationQueryParams>({
    limit: 10,
    offset: 0,
  });

  const {
    stations,
    loading,
    createStation,
    updateStation,
    deleteStation,
    activateStation,
    deactivateStation,
    setMaintenanceMode,
    getStatistics,
  } = useStations({ params: queryParams });

  const [isStationDialogOpen, setIsStationDialogOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<ObservationStation | null>(null);
  const [stats, setStats] = useState<StationStatsResponse | null>(null);
  const [selectedStations, setSelectedStations] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [stationFormData, setStationFormData] = useState<StationFormData>({
    name: '',
    city: '',
    district: '',
    ward: '',
    lat: 21.028511,
    lng: 105.804817,
    streetAddress: '',
    addressLocality: '',
    addressRegion: '',
    addressCountry: 'VN',
    postalCode: '',
    priority: 'medium' as StationPriority,
    categories: [] as string[],
  });

  // Load statistics on mount
  useEffect(() => {
    const loadStats = async () => {
      const statistics = await getStatistics();
      setStats(statistics);
    };
    loadStats();
  }, [getStatistics]);

  const resetStationForm = () => {
    setStationFormData({
      name: '',
      city: '',
      district: '',
      ward: '',
      lat: 21.028511,
      lng: 105.804817,
      streetAddress: '',
      addressLocality: '',
      addressRegion: '',
      addressCountry: 'VN',
      postalCode: '',
      priority: 'medium' as StationPriority,
      categories: [],
    });
    setEditingStation(null);
  };

  const handleOpenStationDialog = (station?: ObservationStation) => {
    if (station) {
      setEditingStation(station);
      setStationFormData({
        name: station.name,
        city: station.city || '',
        district: station.district,
        ward: station.ward || '',
        lat: station.location.lat,
        lng: station.location.lon,
        streetAddress: station.address.streetAddress || '',
        addressLocality: station.address.addressLocality,
        addressRegion: station.address.addressRegion || '',
        addressCountry: station.address.addressCountry || 'VN',
        postalCode: station.address.postalCode || '',
        priority: station.priority || ('medium' as StationPriority),
        categories: station.categories || [],
      });
    } else {
      resetStationForm();
    }
    setIsStationDialogOpen(true);
  };

  const handleFormChange = (formData: StationFormData) => {
    setStationFormData(formData);
  };

  const handleSaveStation = async () => {
    const stationData = {
      name: stationFormData.name,
      city: stationFormData.city,
      district: stationFormData.district,
      ward: stationFormData.ward,
      location: {
        lat: stationFormData.lat,
        lon: stationFormData.lng,
      },
      address: {
        streetAddress: stationFormData.streetAddress,
        addressLocality: stationFormData.addressLocality,
        addressRegion: stationFormData.addressRegion,
        addressCountry: stationFormData.addressCountry,
        postalCode: stationFormData.postalCode,
      },
      priority: stationFormData.priority,
      categories: stationFormData.categories,
    };

    if (editingStation) {
      // Update existing station
      const updated = await updateStation(editingStation.id, stationData as UpdateStationDto);
      if (updated) {
        setIsStationDialogOpen(false);
        resetStationForm();
      }
    } else {
      // Create new station
      const created = await createStation(stationData as CreateStationDto);
      if (created) {
        setIsStationDialogOpen(false);
        resetStationForm();
      }
    }

    // Refresh statistics
    const statistics = await getStatistics();
    setStats(statistics);
  };

  const handleDeleteStation = async (stationId: string) => {
    if (confirm('Are you sure you want to delete this station?')) {
      const success = await deleteStation(stationId);
      if (success) {
        // Refresh statistics
        const statistics = await getStatistics();
        setStats(statistics);
      }
    }
  };

  const handleMapLocationSelect = (lat: number, lng: number) => {
    setStationFormData((prev) => ({
      ...prev,
      lat,
      lng,
    }));
  };

  const handleCancelDialog = () => {
    setIsStationDialogOpen(false);
    resetStationForm();
  };

  // Station selection handlers
  const toggleStationSelection = (stationId: string) => {
    setSelectedStations((prev) =>
      prev.includes(stationId) ? prev.filter((id) => id !== stationId) : [...prev, stationId],
    );
  };

  const toggleSelectAll = () => {
    if (selectedStations.length === stations.length) {
      setSelectedStations([]);
    } else {
      setSelectedStations(stations.map((s) => s.id));
    }
  };

  // Individual station operations (batch operations replaced with individual calls)
  const handleBatchActivate = async () => {
    if (selectedStations.length === 0) return;
    if (confirm(`Activate ${selectedStations.length} stations?`)) {
      let successCount = 0;
      for (const id of selectedStations) {
        const result = await activateStation(id);
        if (result) successCount++;
      }
      if (successCount > 0) {
        setSelectedStations([]);
        const statistics = await getStatistics();
        setStats(statistics);
      }
    }
  };

  const handleBatchDeactivate = async () => {
    if (selectedStations.length === 0) return;
    if (confirm(`Deactivate ${selectedStations.length} stations?`)) {
      let successCount = 0;
      for (const id of selectedStations) {
        const result = await deactivateStation(id);
        if (result) successCount++;
      }
      if (successCount > 0) {
        setSelectedStations([]);
        const statistics = await getStatistics();
        setStats(statistics);
      }
    }
  };

  const handleBatchMaintenance = async () => {
    if (selectedStations.length === 0) return;
    if (confirm(`Set ${selectedStations.length} stations to maintenance mode?`)) {
      let successCount = 0;
      for (const id of selectedStations) {
        const result = await setMaintenanceMode(id);
        if (result) successCount++;
      }
      if (successCount > 0) {
        setSelectedStations([]);
        const statistics = await getStatistics();
        setStats(statistics);
      }
    }
  };

  const handleBatchDelete = async () => {
    if (selectedStations.length === 0) return;
    if (confirm(`Delete ${selectedStations.length} stations? This action cannot be undone.`)) {
      let successCount = 0;
      for (const id of selectedStations) {
        const result = await deleteStation(id);
        if (result) successCount++;
      }
      if (successCount > 0) {
        setSelectedStations([]);
        const statistics = await getStatistics();
        setStats(statistics);
      }
    }
  };

  // Pagination handlers
  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
    setQueryParams((prev) => ({
      ...prev,
      offset: currentPage * itemsPerPage,
    }));
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      setQueryParams((prev) => ({
        ...prev,
        offset: (currentPage - 2) * itemsPerPage,
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-slate-900">System Settings</h2>
        <p className="text-slate-500">Configure weather monitoring stations</p>
      </div>

      <StationStatistics stats={stats} />

      <StationList
        stations={stations}
        loading={loading}
        selectedStations={selectedStations}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onToggleSelect={toggleStationSelection}
        onToggleSelectAll={toggleSelectAll}
        onEdit={handleOpenStationDialog}
        onDelete={handleDeleteStation}
        onAdd={() => handleOpenStationDialog()}
        onBatchActivate={handleBatchActivate}
        onBatchDeactivate={handleBatchDeactivate}
        onBatchMaintenance={handleBatchMaintenance}
        onBatchDelete={handleBatchDelete}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
      />

      <StationDialog
        open={isStationDialogOpen}
        onOpenChange={setIsStationDialogOpen}
        editingStation={editingStation}
        formData={stationFormData}
        onFormChange={handleFormChange}
        onMapLocationSelect={handleMapLocationSelect}
        onSave={handleSaveStation}
        onCancel={handleCancelDialog}
      />
    </div>
  );
}
