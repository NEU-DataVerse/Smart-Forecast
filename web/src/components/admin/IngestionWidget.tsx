/**
 * Ingestion Monitor Widget
 * Displays ingestion service health and allows manual triggering
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIngestion } from '@/hooks/useIngestion';
import { RefreshCw, AlertCircle, CheckCircle, Activity, History, X } from 'lucide-react';
import { useState } from 'react';
import type { HistoricalIngestionType } from '@/types/dto';

export default function IngestionWidget() {
  const {
    health,
    stats,
    loading,
    error,
    lastUpdate,
    refetch,
    triggerIngestion,
    triggerHistoricalIngestion,
  } = useIngestion();
  const [triggering, setTriggering] = useState(false);
  const [showHistoricalDialog, setShowHistoricalDialog] = useState(false);
  const [historicalLoading, setHistoricalLoading] = useState(false);
  const [historicalResult, setHistoricalResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Historical form state
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [selectedTypes, setSelectedTypes] = useState<HistoricalIngestionType[]>([
    'weather',
    'air-quality',
  ]);

  const handleTrigger = async () => {
    setTriggering(true);
    try {
      await triggerIngestion();
    } finally {
      setTriggering(false);
    }
  };

  const handleHistoricalSubmit = async () => {
    if (selectedTypes.length === 0) {
      setHistoricalResult({ success: false, message: 'Vui lòng chọn ít nhất một loại dữ liệu' });
      return;
    }

    // Validate date range (max 7 days)
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays > 7) {
      setHistoricalResult({ success: false, message: 'Khoảng thời gian tối đa là 7 ngày' });
      return;
    }

    if (start >= end) {
      setHistoricalResult({ success: false, message: 'Ngày bắt đầu phải trước ngày kết thúc' });
      return;
    }

    setHistoricalLoading(true);
    setHistoricalResult(null);

    try {
      const result = await triggerHistoricalIngestion({
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        types: selectedTypes,
      });

      const totalRecords = result.weatherRecords + result.airQualityRecords;
      setHistoricalResult({
        success: true,
        message: `Đã thu thập ${totalRecords} bản ghi (Thời tiết: ${result.weatherRecords}, Chất lượng không khí: ${result.airQualityRecords})`,
      });
    } catch (err) {
      setHistoricalResult({
        success: false,
        message: err instanceof Error ? err.message : 'Có lỗi xảy ra khi thu thập dữ liệu',
      });
    } finally {
      setHistoricalLoading(false);
    }
  };

  const toggleType = (type: HistoricalIngestionType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  if (loading && !health) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Dịch vụ thu thập dữ liệu
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Dịch vụ thu thập dữ liệu
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Không thể tải trạng thái thu thập</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isHealthy = health?.status === 'healthy';

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Dịch vụ thu thập dữ liệu
            </div>
            {lastUpdate && (
              <span className="text-xs text-slate-500 font-normal">
                Cập nhật: {new Date(lastUpdate).toLocaleTimeString()}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between space-y-4">
          {/* Health Status */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2">
              {isHealthy ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-orange-500" />
              )}
              <div>
                <p className="text-sm font-medium">Trạng thái dịch vụ</p>
                <p className="text-xs text-slate-500">{health?.status || 'Không xác định'}</p>
              </div>
            </div>
          </div>

          {/* Service Details */}
          {health && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">OpenWeatherMap:</span>
                <span
                  className={`font-medium ${health.services.openWeatherMap === 'configured' ? 'text-green-600' : 'text-red-600'}`}
                >
                  {health.services.openWeatherMap}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Orion-LD:</span>
                <span
                  className={`font-medium ${health.services.orionLD === 'accessible' ? 'text-green-600' : 'text-red-600'}`}
                >
                  {health.services.orionLD}
                </span>
              </div>
            </div>
          )}

          {/* Stats */}
          {stats && (
            <div className="pt-2 border-t border-slate-200">
              <p className="text-xs text-slate-500 mb-2">Địa điểm giám sát</p>
              <p className="text-2xl font-bold text-slate-900">{stats.locations}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <button
                onClick={handleTrigger}
                disabled={triggering}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors text-sm"
              >
                <RefreshCw className={`h-4 w-4 ${triggering ? 'animate-spin' : ''}`} />
                {triggering ? 'Đang thực hiện...' : 'Thu thập hiện tại'}
              </button>
              <button
                onClick={refetch}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm"
              >
                Làm mới
              </button>
            </div>
            <button
              onClick={() => {
                setShowHistoricalDialog(true);
                setHistoricalResult(null);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              <History className="h-4 w-4" />
              Thu thập dữ liệu lịch sử
            </button>
          </div>

          {/* Description */}
          {stats?.description && (
            <p className="text-xs text-slate-500 pt-2 border-t border-slate-200">
              {stats.description}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Historical Ingestion Dialog */}
      {showHistoricalDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Thu thập dữ liệu lịch sử</h3>
              <button
                onClick={() => setShowHistoricalDialog(false)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Ngày bắt đầu
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    max={endDate}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Ngày kết thúc
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <p className="text-xs text-slate-500">Tối đa 7 ngày cho mỗi lần thu thập</p>

              {/* Data Types */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Loại dữ liệu
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes('weather')}
                      onChange={() => toggleType('weather')}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-slate-700">Thời tiết</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes('air-quality')}
                      onChange={() => toggleType('air-quality')}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-slate-700">Chất lượng không khí</span>
                  </label>
                </div>
              </div>

              <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                ⚠️ Lưu ý: Thu thập thời tiết lịch sử yêu cầu API key trả phí từ OpenWeatherMap.
              </p>

              {/* Result Message */}
              {historicalResult && (
                <div
                  className={`p-3 rounded-lg text-sm ${
                    historicalResult.success
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {historicalResult.message}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowHistoricalDialog(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm"
                >
                  Hủy
                </button>
                <button
                  onClick={handleHistoricalSubmit}
                  disabled={historicalLoading || selectedTypes.length === 0}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  {historicalLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Đang thu thập...
                    </>
                  ) : (
                    'Bắt đầu thu thập'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
