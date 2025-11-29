/**
 * Stations Management Page
 * Admin interface for managing monitoring stations
 */

'use client';

import { useStations } from '@/hooks/useStations';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TableSkeleton } from '@/components/shared/Skeleton';
import { MapPin, Filter, RefreshCw, Plus, Edit, Trash2 } from 'lucide-react';
import type { StationStatus, StationPriority, ObservationStation } from '@/types/dto';

export default function StationsPage() {
  const [filters, setFilters] = useState<{
    city?: string;
    district?: string;
    status?: StationStatus;
    priority?: StationPriority;
  }>({});

  const { stations, loading, error, lastUpdate, refetch } = useStations({ params: filters });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-slate-100 text-slate-800',
      maintenance: 'bg-orange-100 text-orange-800',
      retired: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-slate-100 text-slate-800';
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-orange-100 text-orange-800',
      low: 'bg-blue-100 text-blue-800',
    };
    return colors[priority as keyof typeof colors] || 'bg-slate-100 text-slate-800';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-slate-900 text-2xl font-bold">Stations Management</h2>
          <p className="text-slate-500 text-sm">Manage monitoring stations across cities</p>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdate && (
            <span className="text-xs text-slate-500">
              Last update: {new Date(lastUpdate).toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={refetch}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4" />
            Add Station
          </button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm text-slate-600 mb-1 block">City</label>
              <input
                type="text"
                placeholder="Filter by city"
                value={filters.city || ''}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm text-slate-600 mb-1 block">District</label>
              <input
                type="text"
                placeholder="Filter by district"
                value={filters.district || ''}
                onChange={(e) => handleFilterChange('district', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm text-slate-600 mb-1 block">Status</label>
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
                <option value="retired">Retired</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-600 mb-1 block">Priority</label>
              <select
                value={filters.priority || ''}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          {(filters.city || filters.district || filters.status || filters.priority) && (
            <button
              onClick={clearFilters}
              className="mt-3 text-sm text-blue-600 hover:text-blue-700"
            >
              Clear all filters
            </button>
          )}
        </CardContent>
      </Card>

      {/* Stations Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Stations List
            </div>
            {stations && (
              <span className="text-sm font-normal text-slate-500">
                {stations.length} station{stations.length !== 1 ? 's' : ''}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <TableSkeleton rows={5} />
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              <p className="font-medium">Failed to load stations</p>
              <p className="text-sm mt-1">Please try again later.</p>
            </div>
          ) : !stations || stations.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <MapPin className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No stations found</p>
              <p className="text-sm mt-1">Try adjusting your filters or add a new station.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200">
                  <tr className="text-left text-sm text-slate-600">
                    <th className="pb-3 font-medium">Station Name</th>
                    <th className="pb-3 font-medium">Code</th>
                    <th className="pb-3 font-medium">Location</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Priority</th>
                    <th className="pb-3 font-medium">Coordinates</th>
                    <th className="pb-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stations.map((station) => (
                    <tr key={station.id} className="hover:bg-slate-50">
                      <td className="py-3">
                        <div>
                          <p className="font-medium text-slate-900">{station.name}</p>
                          {station.ward && <p className="text-xs text-slate-500">{station.ward}</p>}
                        </div>
                      </td>
                      <td className="py-3 text-sm text-slate-600">{station.code}</td>
                      <td className="py-3">
                        <div className="text-sm">
                          <p className="text-slate-900">{station.district}</p>
                          {station.city && <p className="text-xs text-slate-500">{station.city}</p>}
                        </div>
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(station.status)}`}
                        >
                          {station.status}
                        </span>
                      </td>
                      <td className="py-3">
                        {station.priority && (
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(station.priority)}`}
                          >
                            {station.priority}
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-xs text-slate-600">
                        {station.location.lat.toFixed(4)}, {station.location.lon.toFixed(4)}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <Edit className="h-4 w-4 text-slate-600" />
                          </button>
                          <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
