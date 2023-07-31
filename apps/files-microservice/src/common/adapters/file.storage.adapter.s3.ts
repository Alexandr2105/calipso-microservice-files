import { Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { settings } from '../../settings';

@Injectable()
export class FileStorageAdapterS3 {
  s3Client: S3Client;
  constructor() {
    const REGION = 'ru-central1';
    this.s3Client = new S3Client({
      region: REGION,
      endpoint: settings.BASE_URL_AWS,
      credentials: {
        accessKeyId: settings.ACCESS_KEY_ID,
        secretAccessKey: settings.SECRET_ACCESS_KEY,
      },
    });
  }

  async saveAvatar(userId: string, buffer: Buffer) {
    const key = `${userId}/avatars/${userId}&${+new Date()}_avatar.png`;

    const command = new PutObjectCommand({
      Bucket: settings.BACKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: 'image/png',
    });
    try {
      await this.s3Client.send(command);
      return {
        id: randomUUID(),
        key: key,
        createdAt: new Date(),
        bucket: settings.BACKET_NAME,
      };
    } catch (err) {
      console.error(err);
    }
  }

  async saveImagesForPost(
    userId: string,
    buffer: Buffer,
    postId: string,
  ): Promise<any> {
    const randomName = randomUUID();
    const command = new PutObjectCommand({
      Bucket: settings.BACKET_NAME,
      Key: `${userId}/posts/${postId}/${randomName}_post.png`,
      Body: buffer,
      ContentType: 'image/png',
    });
    try {
      await this.s3Client.send(command);
      return {
        id: randomUUID(),
        key: `${userId}/posts/${postId}/${randomName}_post.png`,
        postId: postId,
        createdAt: new Date(),
        bucket: settings.BACKET_NAME,
      };
    } catch (err) {
      console.error(err);
    }
  }

  async deleteImage(bucket: string, key: string) {
    const command = new DeleteObjectCommand({ Bucket: bucket, Key: key });
    try {
      await this.s3Client.send(command);
    } catch (err) {
      console.error(err);
    }
  }
}
