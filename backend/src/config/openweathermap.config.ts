import { registerAs } from '@nestjs/config';

export default registerAs('openweathermap', () => ({
  apiKey: process.env.OPENWEATHERMAP_API_KEY || '',
}));
