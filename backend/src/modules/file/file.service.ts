import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  private readonly minioClient: Minio.Client;
  private readonly bucketName: string;
  private readonly endpoint: string;
  private readonly port: number;

  constructor(private readonly configService: ConfigService) {
    const minioConfig = this.configService.get('minio');

    this.endpoint = minioConfig.endpoint;
    this.port = minioConfig.port;
    this.bucketName = minioConfig.bucketName;

    this.minioClient = new Minio.Client({
      endPoint: minioConfig.endpoint,
      port: minioConfig.port,
      useSSL: minioConfig.useSSL,
      accessKey: minioConfig.accessKey,
      secretKey: minioConfig.secretKey,
    });

    this.initializeBucket();
  }

  /**
   * Initialize MinIO bucket with public-read policy
   */
  private async initializeBucket(): Promise<void> {
    try {
      const bucketExists = await this.minioClient.bucketExists(this.bucketName);

      if (!bucketExists) {
        await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
        this.logger.log(`Bucket ${this.bucketName} created successfully`);

        // Set public-read policy for the bucket
        const policy = {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: { AWS: ['*'] },
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${this.bucketName}/*`],
            },
          ],
        };

        await this.minioClient.setBucketPolicy(
          this.bucketName,
          JSON.stringify(policy),
        );
        this.logger.log(`Bucket ${this.bucketName} set to public-read`);
      } else {
        this.logger.log(`Bucket ${this.bucketName} already exists`);
      }
    } catch (error) {
      this.logger.error(
        `Error initializing bucket: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Upload an image file to MinIO
   * @param file - Uploaded file buffer
   * @param originalName - Original filename
   * @returns Public URL of the uploaded file
   */
  async uploadImage(file: Express.Multer.File): Promise<string> {
    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPEG, JPG, and PNG are allowed.',
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size must not exceed 5MB');
    }

    // Generate unique filename
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;

    try {
      // Upload to MinIO
      await this.minioClient.putObject(
        this.bucketName,
        fileName,
        file.buffer,
        file.size,
        {
          'Content-Type': file.mimetype,
        },
      );

      // Generate public URL
      const publicUrl = `http://${this.endpoint}:${this.port}/${this.bucketName}/${fileName}`;

      this.logger.log(`File uploaded successfully: ${fileName}`);
      return publicUrl;
    } catch (error) {
      this.logger.error(`Error uploading file: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to upload file');
    }
  }

  /**
   * Upload multiple images
   * @param files - Array of uploaded files
   * @returns Array of public URLs
   */
  async uploadMultipleImages(files: Express.Multer.File[]): Promise<string[]> {
    const uploadPromises = files.map((file) => this.uploadImage(file));
    return Promise.all(uploadPromises);
  }

  /**
   * Delete a file from MinIO
   * @param fileName - Name of the file to delete
   */
  async deleteFile(fileName: string): Promise<void> {
    try {
      await this.minioClient.removeObject(this.bucketName, fileName);
      this.logger.log(`File deleted successfully: ${fileName}`);
    } catch (error) {
      this.logger.error(`Error deleting file: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to delete file');
    }
  }
}
