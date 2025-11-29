/**
 * Ingestion Monitor Widget
 * Displays ingestion service health and allows manual triggering
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIngestion } from '@/hooks/useIngestion';
import { RefreshCw, AlertCircle, CheckCircle, Activity } from 'lucide-react';
import { useState } from 'react';

export default function IngestionWidget() {
  const { health, stats, loading, error, lastUpdate, refetch, triggerIngestion } = useIngestion();
  const [triggering, setTriggering] = useState(false);

  const handleTrigger = async () => {
    setTriggering(true);
    try {
      await triggerIngestion();
    } finally {
      setTriggering(false);
    }
  };

  if (loading && !health) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Data Ingestion Service
          </CardTitle>
        </CardHeader>
        <CardContent>
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
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Data Ingestion Service
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Failed to load ingestion status</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isHealthy = health?.status === 'healthy';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Data Ingestion Service
          </div>
          {lastUpdate && (
            <span className="text-xs text-slate-500 font-normal">
              Updated: {new Date(lastUpdate).toLocaleTimeString()}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Health Status */}
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-2">
            {isHealthy ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-orange-500" />
            )}
            <div>
              <p className="text-sm font-medium">Service Status</p>
              <p className="text-xs text-slate-500">{health?.status || 'Unknown'}</p>
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
            <p className="text-xs text-slate-500 mb-2">Monitoring Locations</p>
            <p className="text-2xl font-bold text-slate-900">{stats.locations}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleTrigger}
            disabled={triggering}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors text-sm"
          >
            <RefreshCw className={`h-4 w-4 ${triggering ? 'animate-spin' : ''}`} />
            {triggering ? 'Triggering...' : 'Trigger Ingestion'}
          </button>
          <button
            onClick={refetch}
            className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm"
          >
            Refresh
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
  );
}
