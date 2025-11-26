import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    const firebaseConfig = this.configService.get('firebase');

    if (
      !firebaseConfig?.projectId ||
      !firebaseConfig?.privateKey ||
      !firebaseConfig?.clientEmail
    ) {
      this.logger.warn(
        'Firebase configuration is incomplete. Push notifications will not work.',
      );
      return;
    }

    try {
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: firebaseConfig.projectId,
            privateKey: firebaseConfig.privateKey,
            clientEmail: firebaseConfig.clientEmail,
          }),
        });
        this.logger.log('Firebase Admin SDK initialized successfully');
      }
    } catch (error) {
      this.logger.error(
        `Failed to initialize Firebase Admin SDK: ${error.message}`,
        error.stack,
      );
    }
  }

  getMessaging(): admin.messaging.Messaging {
    return admin.messaging();
  }
}
