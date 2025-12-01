'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/text-area';
import { Label } from '@/components/ui/label';
import {
  MapPin,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  PlayCircle,
  CheckCircle2,
} from 'lucide-react';
import { IIncident, IncidentStatus } from '@smart-forecast/shared';
import { IncidentTypeLabels, IncidentStatusLabels } from '@smart-forecast/shared';
import { formatDate, getLocationString, getReporterName, getStatusVariant } from './report-utils';

interface ReportDetailsDialogProps {
  report: IIncident | null;
  open: boolean;
  onClose: () => void;
  onApprove: (reportId: string, notes?: string) => void;
  onReject: (reportId: string, notes: string) => void;
  onCreateAlert: () => void;
  onStartProgress?: (reportId: string, notes?: string) => void;
  onMarkResolved?: (reportId: string, notes?: string) => void;
  isUpdating?: boolean;
}

/**
 * Mini Map Component for displaying incident location
 */
function IncidentMiniMap({ coordinates }: { coordinates: [number, number] }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const [lng, lat] = coordinates;

    const mapStyle = {
      version: 8 as const,
      sources: {
        osm: {
          type: 'raster' as const,
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '© OpenStreetMap contributors',
        },
      },
      layers: [
        {
          id: 'osm',
          type: 'raster' as const,
          source: 'osm',
        },
      ],
    };

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [lng, lat],
      zoom: 15,
      interactive: false, // Read-only map
    });

    // Add marker at incident location
    new maplibregl.Marker({ color: '#ef4444' }).setLngLat([lng, lat]).addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [coordinates]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-[200px] rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
    />
  );
}

/**
 * Image Gallery Component
 */
function ImageGallery({ images }: { images: string[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const handlePrev = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null && selectedIndex < images.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <>
      {/* Thumbnail Grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
        {images.map((url, i) => (
          <button
            key={i}
            onClick={() => setSelectedIndex(i)}
            className="aspect-square bg-slate-100 rounded-lg overflow-hidden relative hover:ring-2 hover:ring-blue-400 transition-all"
          >
            {!imageErrors[i] ? (
              <Image
                src={url}
                alt={`Image ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 33vw, 25vw"
                onError={() => handleImageError(i)}
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-slate-400" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-4 right-4 text-white hover:text-slate-300 z-10"
          >
            <X className="h-8 w-8" />
          </button>

          {selectedIndex > 0 && (
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-slate-300"
            >
              <ChevronLeft className="h-10 w-10" />
            </button>
          )}

          <div className="relative w-full max-w-4xl h-[80vh]">
            {!imageErrors[selectedIndex] ? (
              <Image
                src={images[selectedIndex]}
                alt={`Image ${selectedIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                onError={() => handleImageError(selectedIndex)}
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                <ImageIcon className="h-16 w-16" />
              </div>
            )}
          </div>

          {selectedIndex < images.length - 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-slate-300"
            >
              <ChevronRight className="h-10 w-10" />
            </button>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}

export function ReportDetailsDialog({
  report,
  open,
  onClose,
  onApprove,
  onReject,
  onCreateAlert,
  onStartProgress,
  onMarkResolved,
  isUpdating = false,
}: ReportDetailsDialogProps) {
  const [adminNotes, setAdminNotes] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  if (!report) return null;

  const handleApprove = () => {
    onApprove(report.id, adminNotes || undefined);
    setAdminNotes('');
  };

  const handleReject = () => {
    if (showRejectForm) {
      if (!adminNotes.trim()) {
        return; // Require notes for rejection
      }
      onReject(report.id, adminNotes);
      setAdminNotes('');
      setShowRejectForm(false);
    } else {
      setShowRejectForm(true);
    }
  };

  const handleStartProgress = () => {
    onStartProgress?.(report.id, adminNotes || undefined);
    setAdminNotes('');
  };

  const handleMarkResolved = () => {
    onMarkResolved?.(report.id, adminNotes || undefined);
    setAdminNotes('');
  };

  const handleClose = () => {
    setAdminNotes('');
    setShowRejectForm(false);
    onClose();
  };

  const isPending = report.status === IncidentStatus.PENDING;
  const isVerified = report.status === IncidentStatus.VERIFIED;
  const isInProgress = report.status === IncidentStatus.IN_PROGRESS;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết báo cáo</DialogTitle>
          <DialogDescription>Xem và xử lý báo cáo sự cố từ người dùng</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-slate-900">{IncidentTypeLabels[report.type]}</h3>
              <p className="text-sm text-slate-500">ID báo cáo: {report.id.slice(0, 8)}...</p>
            </div>
            <Badge variant={getStatusVariant(report.status)}>
              {IncidentStatusLabels[report.status]}
            </Badge>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500">Người báo cáo</p>
              <p className="text-slate-900">{getReporterName(report.reportedBy)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Thời gian</p>
              <p className="text-slate-900">{formatDate(report.createdAt)}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-sm text-slate-500 mb-1">Mô tả</p>
            <p className="text-slate-900 bg-slate-50 p-3 rounded-lg">{report.description}</p>
          </div>

          {/* Location */}
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Vị trí</p>
            <div className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg mb-2">
              <MapPin className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-slate-900 dark:text-slate-100">
                  {getLocationString(report.location.coordinates)}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Lat: {report.location.coordinates[1]}, Lng: {report.location.coordinates[0]}
                </p>
              </div>
            </div>
            <IncidentMiniMap coordinates={report.location.coordinates as [number, number]} />
          </div>

          {/* Images */}
          <div>
            <p className="text-sm text-slate-500 mb-2">
              Hình ảnh ({report.imageUrls?.length || 0})
            </p>
            {report.imageUrls && report.imageUrls.length > 0 ? (
              <ImageGallery images={report.imageUrls} />
            ) : (
              <div className="bg-slate-100 rounded-lg p-8 flex items-center justify-center">
                <p className="text-slate-500">Không có hình ảnh</p>
              </div>
            )}
          </div>

          {/* Existing Admin Notes (if any) */}
          {report.adminNotes && (
            <div>
              <p className="text-sm text-slate-500 mb-1">Ghi chú của Admin</p>
              <p className="text-slate-900 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                {report.adminNotes}
              </p>
            </div>
          )}

          {/* Verifier info */}
          {report.verifiedBy && (
            <div>
              <p className="text-sm text-slate-500 mb-1">Xác nhận bởi</p>
              <p className="text-slate-900">{getReporterName(report.verifiedBy)}</p>
            </div>
          )}

          {/* Admin Notes Input (for pending reports) */}
          {isPending && (
            <div>
              <Label htmlFor="adminNotes" className="text-sm text-slate-500">
                {showRejectForm ? 'Lý do từ chối (bắt buộc)' : 'Ghi chú (tùy chọn)'}
              </Label>
              <Textarea
                id="adminNotes"
                placeholder={
                  showRejectForm
                    ? 'Nhập lý do từ chối báo cáo này...'
                    : 'Thêm ghi chú cho báo cáo này...'
                }
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>
          )}

          {/* Admin Notes Input (for verified/in-progress reports) */}
          {(isVerified || isInProgress) && (
            <div>
              <Label htmlFor="adminNotes" className="text-sm text-slate-500">
                Ghi chú cập nhật (tùy chọn)
              </Label>
              <Textarea
                id="adminNotes"
                placeholder="Thêm ghi chú cho việc xử lý sự cố..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>
          )}

          {/* Action Buttons */}
          {isPending && (
            <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
              {!showRejectForm ? (
                <>
                  <Button className="flex-1" onClick={handleApprove} disabled={isUpdating}>
                    {isUpdating ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Xác nhận báo cáo
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={onCreateAlert}>
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Tạo cảnh báo
                  </Button>
                  <Button
                    variant="destructive"
                    className="sm:flex-initial"
                    onClick={handleReject}
                    disabled={isUpdating}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Từ chối
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowRejectForm(false);
                      setAdminNotes('');
                    }}
                  >
                    Hủy
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={handleReject}
                    disabled={!adminNotes.trim() || isUpdating}
                  >
                    {isUpdating ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-2" />
                    )}
                    Xác nhận từ chối
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Actions for VERIFIED status */}
          {isVerified && onStartProgress && (
            <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
              <Button className="flex-1" onClick={handleStartProgress} disabled={isUpdating}>
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <PlayCircle className="h-4 w-4 mr-2" />
                )}
                Bắt đầu xử lý
              </Button>
              <Button variant="outline" className="flex-1" onClick={onCreateAlert}>
                <AlertTriangle className="h-4 w-4 mr-2" />
                Tạo cảnh báo
              </Button>
            </div>
          )}

          {/* Actions for IN_PROGRESS status */}
          {isInProgress && onMarkResolved && (
            <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={handleMarkResolved}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                )}
                Đánh dấu đã giải quyết
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
