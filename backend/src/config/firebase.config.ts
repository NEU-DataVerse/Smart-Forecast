import { registerAs } from '@nestjs/config';

export interface FirebaseConfig {
  projectId: string;
  privateKey: string;
  clientEmail: string;
}

export default registerAs('firebase', (): FirebaseConfig => {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY || '';

  return {
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    // Replace escaped newlines in private key
    privateKey: privateKey.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
  };
});
