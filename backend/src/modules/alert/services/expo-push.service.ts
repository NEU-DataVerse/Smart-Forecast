import { Injectable, Logger } from '@nestjs/common';

export interface ExpoPushMessage {
  to: string | string[];
  title: string;
  body: string;
  data?: Record<string, string>;
  sound?: 'default' | null;
  badge?: number;
  priority?: 'default' | 'normal' | 'high';
  channelId?: string;
}

export interface ExpoPushTicket {
  status: 'ok' | 'error';
  id?: string;
  message?: string;
  details?: { error: string };
}

export interface ExpoPushResult {
  successCount: number;
  failureCount: number;
  failedTokens: string[];
}

/**
 * Expo Push Notification Service
 * Sends push notifications via Expo Push API
 * Works with Expo Push Tokens (ExponentPushToken[xxx])
 */
@Injectable()
export class ExpoPushService {
  private readonly logger = new Logger(ExpoPushService.name);
  private readonly EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';
  private readonly BATCH_SIZE = 100; // Expo recommends max 100 per request

  /**
   * Send notification to multiple devices using Expo Push API
   * @param tokens - Array of Expo Push Tokens (ExponentPushToken[xxx])
   * @param notification - Notification payload
   * @returns Number of successful sends and failed tokens
   */
  async sendBulkNotification(
    tokens: string[],
    notification: {
      title: string;
      body: string;
      data?: Record<string, string>;
    },
  ): Promise<ExpoPushResult> {
    if (!tokens || tokens.length === 0) {
      this.logger.warn('No Expo push tokens provided');
      return { successCount: 0, failureCount: 0, failedTokens: [] };
    }

    // Filter valid Expo push tokens
    const validTokens = tokens.filter((token) =>
      this.isValidExpoPushToken(token),
    );
    const invalidTokens = tokens.filter(
      (token) => !this.isValidExpoPushToken(token),
    );

    if (invalidTokens.length > 0) {
      this.logger.warn(
        `Found ${invalidTokens.length} invalid Expo push tokens (not ExponentPushToken format)`,
      );
    }

    if (validTokens.length === 0) {
      this.logger.warn('No valid Expo push tokens to send');
      return {
        successCount: 0,
        failureCount: tokens.length,
        failedTokens: tokens,
      };
    }

    const failedTokens: string[] = [...invalidTokens];
    let successCount = 0;
    let failureCount = invalidTokens.length;

    // Process in batches
    for (let i = 0; i < validTokens.length; i += this.BATCH_SIZE) {
      const batch = validTokens.slice(i, i + this.BATCH_SIZE);
      const messages: ExpoPushMessage[] = batch.map((token) => ({
        to: token,
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
        sound: 'default',
        priority: 'high',
        channelId: 'default',
      }));

      try {
        const response = await fetch(this.EXPO_PUSH_URL, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Accept-Encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(messages),
        });

        if (!response.ok) {
          const errorText = await response.text();
          this.logger.error(
            `Expo Push API error: ${response.status} - ${errorText}`,
          );
          failureCount += batch.length;
          failedTokens.push(...batch);
          continue;
        }

        const result = await response.json();
        const tickets: ExpoPushTicket[] = result.data || [];

        tickets.forEach((ticket, index) => {
          if (ticket.status === 'ok') {
            successCount++;
          } else {
            failureCount++;
            failedTokens.push(batch[index]);
            this.logger.warn(
              `Failed to send to ${batch[index]}: ${ticket.message || ticket.details?.error}`,
            );
          }
        });
      } catch (error) {
        this.logger.error(
          `Error sending Expo push batch: ${error.message}`,
          error.stack,
        );
        failureCount += batch.length;
        failedTokens.push(...batch);
      }
    }

    this.logger.log(
      `Expo Push batch send: ${successCount} successful, ${failureCount} failed`,
    );

    return {
      successCount,
      failureCount,
      failedTokens,
    };
  }

  /**
   * Send notification to a single device
   * @param token - Expo Push Token
   * @param notification - Notification payload
   */
  async sendToDevice(
    token: string,
    notification: {
      title: string;
      body: string;
      data?: Record<string, string>;
    },
  ): Promise<boolean> {
    const result = await this.sendBulkNotification([token], notification);
    return result.successCount > 0;
  }

  /**
   * Check if a token is a valid Expo Push Token format
   * Valid format: ExponentPushToken[xxx] or ExpoPushToken[xxx]
   */
  private isValidExpoPushToken(token: string): boolean {
    return (
      typeof token === 'string' &&
      (token.startsWith('ExponentPushToken[') ||
        token.startsWith('ExpoPushToken['))
    );
  }
}
