import { registerAs } from '@nestjs/config';

export default registerAs('google', () => ({
  clientId: process.env.GOOGLE_CLIENT_ID,
  // Note: Client Secret not required for Android/iOS OAuth (public clients)
  // Only Web Applications have client_secret
}));
