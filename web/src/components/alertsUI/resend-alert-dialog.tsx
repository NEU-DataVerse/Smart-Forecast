import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/text-area';
import { Send } from 'lucide-react';
import { IAlert } from '@/../../shared/src/types/alert.types';

interface ResendAlertDialogProps {
  alert: IAlert | null;
  open: boolean;
  message: string;
  onMessageChange: (message: string) => void;
  onClose: () => void;
  onResend: () => void;
}

export function ResendAlertDialog({
  alert,
  open,
  message,
  onMessageChange,
  onClose,
  onResend,
}: ResendAlertDialogProps) {
  if (!alert) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resend Alert</DialogTitle>
          <DialogDescription>Update and resend this alert to nearby areas</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Alert Title</Label>
            <p className="text-slate-900 mt-1">{alert.title}</p>
          </div>

          <div>
            <Label>Alert Type</Label>
            <p className="text-slate-900 mt-1">{alert.type}</p>
          </div>

          <div>
            <Label>Alert Message</Label>
            <Textarea
              placeholder="Enter or update alert message..."
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              rows={4}
              className="mt-1"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={onResend} className="flex-1">
              <Send className="h-4 w-4 mr-2" />
              Resend Alert
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
