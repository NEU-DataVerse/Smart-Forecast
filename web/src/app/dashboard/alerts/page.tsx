'use client';

import { useState } from 'react';
import { alertHistory } from '@/services/data/alert.api';
import { IAlert } from '@/../../shared/src/types/alert.types';
import { AlertHeader } from '@/components/alertsUI/alert-header';
import SummaryStarts from '@/components/alertsUI/summary-starts';
import { AlertListItem } from '@/components/alertsUI/alert-list-item';
import { AlertDetailsDialog } from '@/components/alertsUI/alert-details-dialog';
import { ResendAlertDialog } from '@/components/alertsUI/resend-alert-dialog';

export default function AlertsPage() {
  const [selectedAlert, setSelectedAlert] = useState<IAlert | null>(null);
  const [showResendDialog, setShowResendDialog] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const handleViewAlert = (alert: IAlert) => {
    setSelectedAlert(alert);
    setShowResendDialog(false);
  };

  const handleOpenResendDialog = (alert: IAlert) => {
    setSelectedAlert(alert);
    setResendMessage(alert.message);
    setShowResendDialog(true);
  };

  const handleResend = () => {
    setShowResendDialog(false);
    setResendMessage('');
    setSelectedAlert(null);
  };

  const handleCloseDialogs = () => {
    setSelectedAlert(null);
    setShowResendDialog(false);
  };

  return (
    <div className="space-y-6">
      <AlertHeader />
      <SummaryStarts />

      <div className="space-y-4">
        {alertHistory.map((alert) => (
          <AlertListItem
            key={alert.id}
            alert={alert}
            onView={handleViewAlert}
            onResend={handleOpenResendDialog}
          />
        ))}
      </div>

      <AlertDetailsDialog
        alert={selectedAlert}
        open={!!selectedAlert && !showResendDialog}
        onClose={handleCloseDialogs}
        onResend={handleOpenResendDialog}
      />

      <ResendAlertDialog
        alert={selectedAlert}
        open={showResendDialog}
        message={resendMessage}
        onMessageChange={setResendMessage}
        onClose={handleCloseDialogs}
        onResend={handleResend}
      />
    </div>
  );
}
