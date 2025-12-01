'use client';

import { useState, useEffect } from 'react';
import { useStations } from '@/hooks/useStations';
import {
  StationStatistics,
  StationList,
  StationDialog,
  type StationFormData,
} from '@/components/settings';
import { ExportReportButton } from '@/components/reportsUI/export-report-button';
import { ExportReportDialog } from '@/components/reportsUI/export-report-dialog';
import { ReportType } from '@/types/dto/report.dto';
import { useUserContext } from '@/context/userContext';
import { UserRole } from '@smart-forecast/shared';
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

  const { user } = useUserContext();
  const isAdmin = user?.role === UserRole.ADMIN;

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
    if (confirm('Bạn có chắc chắn muốn xóa trạm này không?')) {
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
    if (confirm(`Kích hoạt ${selectedStations.length} trạm?`)) {
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
    if (confirm(`Vô hiệu hóa ${selectedStations.length} trạm?`)) {
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
    if (confirm(`Đặt ${selectedStations.length} trạm vào chế độ bảo trì?`)) {
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
    if (confirm(`Xóa ${selectedStations.length} trạm? Hành động này không thể hoàn tác.`)) {
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-slate-900">Cài đặt hệ thống</h2>
          <p className="text-slate-500">Cấu hình trạm quan trắc thời tiết</p>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-2">
            <ExportReportButton reportType={ReportType.STATIONS} />
            <ExportReportDialog
              reportType={ReportType.STATIONS}
              showDateRange={false}
              showStationFilter={false}
              trigger={
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-3">
                  Xuất nâng cao
                </button>
              }
            />
          </div>
        )}
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
