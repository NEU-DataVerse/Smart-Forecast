import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export function AlertHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-slate-900">Alert History</h2>
        <p className="text-slate-500">View and manage sent disaster alerts</p>
      </div>
      <Button>
        <AlertTriangle className="h-4 w-4 mr-2" />
        Create New Alert
      </Button>
    </div>
  );
}
