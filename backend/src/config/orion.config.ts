import { registerAs } from '@nestjs/config';

export default registerAs('orion', () => ({
  url: process.env.ORION_LD_URL || 'http://localhost:1026',
  apiVersion: process.env.ORION_LD_API_VERSION || 'ngsi-ld/v1',
  tenant: process.env.ORION_LD_TENANT || '',
}));
