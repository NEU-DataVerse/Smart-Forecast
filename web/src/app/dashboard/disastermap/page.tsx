'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MapPin, Send, X } from 'lucide-react';
import { Textarea } from '@/components/ui/text-area';
import { Label } from '@/components/ui/label';
import GoongMap from '@/components/disasterUI/disaster-map';

interface DisasterPoint {
  id: number;
  lat: number;
  lng: number;
  type: string;
  severity: 'High' | 'Medium' | 'Low';
  reports: number;
  description: string;
  location: string;
  timestamp: string;
}

export default function Disaster() {
  const [selectedPoint, setSelectedPoint] = useState<DisasterPoint | null>(null);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleSendAlert = () => {
    // TODO: Implement actual alert sending
    setShowAlertDialog(false);
    setAlertMessage('');
    setSelectedPoint(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-slate-900">Disaster Map</h2>
        <p className="text-slate-500">Interactive map with user-reported incidents</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Area */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Live Disaster Reports</CardTitle>
            <CardDescription>Click on markers to view details and send alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-[500px] rounded-lg overflow-hidden">
              <GoongMap />
            </div>

            {/* Map Legend */}
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full" />
                <span className="text-slate-600">High Severity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 rounded-full" />
                <span className="text-slate-600">Medium Severity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full" />
                <span className="text-slate-600">Low Severity</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Incident Details</CardTitle>
            <CardDescription>
              {selectedPoint ? 'Report information' : 'Select a marker to view details'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedPoint ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-slate-900">{selectedPoint.type}</h3>
                    <p className="text-slate-500">{selectedPoint.location}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedPoint(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Severity</span>
                    <Badge
                      variant={
                        selectedPoint.severity === 'High'
                          ? 'destructive'
                          : selectedPoint.severity === 'Medium'
                            ? 'default'
                            : 'secondary'
                      }
                    >
                      {selectedPoint.severity}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Reports</span>
                    <span className="text-slate-900">{selectedPoint.reports} submissions</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Time</span>
                    <span className="text-slate-900">{selectedPoint.timestamp}</span>
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <p className="text-slate-600 mt-1">{selectedPoint.description}</p>
                </div>

                <div>
                  <Label>Coordinates</Label>
                  <p className="text-slate-600 mt-1">
                    {selectedPoint.lat}°N, {Math.abs(selectedPoint.lng)}°W
                  </p>
                </div>

                <Button className="w-full" onClick={() => setShowAlertDialog(true)}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Alert to Nearby Areas
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Click on a map marker to view incident details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alert Dialog */}
      <Dialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Disaster Alert</DialogTitle>
            <DialogDescription>
              Create and broadcast an alert to users near {selectedPoint?.location}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Incident Type</Label>
              <div className="text-slate-900 mt-1">{selectedPoint?.type}</div>
            </div>

            <div>
              <Label>Alert Message</Label>
              <Textarea
                placeholder="Enter alert message for nearby users..."
                value={alertMessage}
                onChange={(e) => setAlertMessage(e.target.value)}
                rows={4}
                className="mt-1"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSendAlert} className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                Send Alert
              </Button>
              <Button variant="outline" onClick={() => setShowAlertDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
