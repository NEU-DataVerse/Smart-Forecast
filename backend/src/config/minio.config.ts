import { registerAs } from '@nestjs/config';

export interface MinioConfig {
  endpoint: string;
  port: number;
  accessKey: string;
  secretKey: string;
  useSSL: boolean;
  bucketName: string;
  /** Public URL for client access (browser/mobile) */
  publicUrl: string;
}

export default registerAs('minio', (): MinioConfig => {
  const endpoint = process.env.MINIO_ENDPOINT || 'localhost';
  const port = parseInt(process.env.MINIO_PORT || '9000', 10);

  // Public URL - defaults to http://localhost:8002 for docker-compose production
  // This is the URL that browsers/mobile apps will use to access files
  const defaultPublicUrl = `http://localhost:${port}`;

  return {
    endpoint,
    port,
    accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    useSSL: process.env.MINIO_USE_SSL === 'true',
    bucketName: process.env.MINIO_BUCKET_NAME || 'incidents',
    publicUrl: process.env.MINIO_PUBLIC_URL || defaultPublicUrl,
  };
});
