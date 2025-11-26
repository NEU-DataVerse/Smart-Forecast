import { Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import * as admin from 'firebase-admin';

export interface FcmNotification {
  title: string;
  body: string;
  data?: Record<string, string>;
}

@Injectable()
export class FcmService {
  private readonly logger = new Logger(FcmService.name);

  constructor(private readonly firebaseService: FirebaseService) {}

  /**
   * Send notification to multiple devices
   * @param tokens - Array of FCM tokens
   * @param notification - Notification payload
   * @returns Number of successful sends and failed tokens
   */
  async sendBulkNotification(
    tokens: string[],
    notification: FcmNotification,
  ): Promise<{
    successCount: number;
    failureCount: number;
    failedTokens: string[];
  }> {
    if (!tokens || tokens.length === 0) {
      this.logger.warn('No FCM tokens provided');
      return { successCount: 0, failureCount: 0, failedTokens: [] };
    }

    const messaging = this.firebaseService.getMessaging();
    const failedTokens: string[] = [];

    try {
      const message: admin.messaging.MulticastMessage = {
        notification: {
          title: notification.title,
          body: notification.body,
        },
        data: notification.data || {},
        tokens,
      };

      const response = await messaging.sendEachForMulticast(message);

      this.logger.log(
        `FCM batch send: ${response.successCount} successful, ${response.failureCount} failed`,
      );

      // Collect failed tokens for cleanup
      if (response.failureCount > 0) {
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(tokens[idx]);
            this.logger.warn(
              `Failed to send to token ${tokens[idx]}: ${resp.error?.message}`,
            );
          }
        });
      }

      return {
        successCount: response.successCount,
        failureCount: response.failureCount,
        failedTokens,
      };
    } catch (error) {
      this.logger.error(
        `Error sending bulk notification: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Send notification to a single device
   * @param token - FCM token
   * @param notification - Notification payload
   */
  async sendToDevice(
    token: string,
    notification: FcmNotification,
  ): Promise<boolean> {
    const result = await this.sendBulkNotification([token], notification);
    return result.successCount > 0;
  }
}
