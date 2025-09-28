import {
  CopyObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { format } from 'date-fns';
import { inject, injectable } from 'inversify';
import * as path from 'path';
import { sift } from 'radash';

import { IConfigService } from '@/config';
import { DownloadInfo, FileInfo, UploadedFile, UploadInfo } from './types';

export interface IBucketService {
  deleteFiles(filePaths: string[]): Promise<void>;
  moveFile(sourceUrl: string, destinationUrl: string): Promise<void>;
  getPublicUrls(fileKeys: UploadedFile[]): Promise<UploadedFile[]>;
  getFileKeysFromPublicUrls(publicUrls: UploadedFile[]): UploadedFile[];
  getUploadInfo(fileInfo: FileInfo[]): Promise<UploadInfo>[];
  getPublicImageUrls(urlsKey: string[]): string[];
  getUrlKeysFromPublicImageUrls(publicUrls: string[]): string[];
  uploadFileToS3(buffer: Buffer, s3FilePath: string): Promise<DownloadInfo>;
}

@injectable()
export class S3BucketService implements IBucketService {
  private s3Client: S3Client;
  private bucket: string;
  private region: string;

  constructor(@inject('IConfigService') private readonly configService: IConfigService) {
    this.bucket = this.configService.get<string>('S3_BUCKET');
    this.region = this.configService.get<string>('S3_REGION');

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.get<string>('S3_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>('S3_SECRET_ACCESS_KEY')
      }
    });
  }

  private renameFileUploadToS3(fileName: string): string {
    return `${fileName.replace(/[^a-zA-Z0-9/!_.*'()]/g, '-')}-${format(new Date(), 'yyyyMMddHHmmssSSS')}`;
  }

  public async getPresignedURLForUpload(fileName: string, type: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: fileName,
      ContentType: type,
      ACL: 'public-read'
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn: 300 }); // 5 min
  }

  public async deleteFiles(filePaths: string[]): Promise<void> {
    try {
      const command = new DeleteObjectsCommand({
        Bucket: this.bucket,
        Delete: {
          Objects: filePaths.map((Key) => ({ Key }))
        }
      });
      await this.s3Client.send(command);
    } catch (error) {
      console.error('S3 delete error:', error);
      throw new Error('S3 delete failed');
    }
  }

  public async moveFile(sourcePrefix: string, destinationPrefix: string): Promise<void> {
    try {
      const listCommand = new ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: sourcePrefix
      });

      const response = await this.s3Client.send(listCommand);
      const contents = response.Contents || [];

      await Promise.all(
        contents.map(async (item) => {
          if (!item.Key) return;

          const newKey = item.Key.replace(sourcePrefix, destinationPrefix);

          await this.s3Client.send(
            new CopyObjectCommand({
              Bucket: this.bucket,
              CopySource: `${this.bucket}/${item.Key}`,
              Key: newKey,
              ACL: 'public-read'
            })
          );

          await this.s3Client.send(
            new DeleteObjectCommand({
              Bucket: this.bucket,
              Key: item.Key
            })
          );
        })
      );
    } catch (error) {
      console.error('S3 move error:', error);
      throw new Error('S3 move failed');
    }
  }

  public async getPublicUrls(fileKeys: UploadedFile[]): Promise<UploadedFile[]> {
    const urls = await Promise.all(
      fileKeys.map(async (file) => {
        const isXML = file.name.toLowerCase().endsWith('.xml');
        const url = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${file.url}`;

        if (isXML) {
          const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: file.url,
            ResponseContentDisposition: `attachment; filename="${encodeURIComponent(file.name)}"`
          });

          const presignedUrl = await getSignedUrl(this.s3Client, command, {
            expiresIn: 3600
          });

          return { name: file.name, url: presignedUrl };
        }

        return { name: file.name, url };
      })
    );

    return urls;
  }

  public getFileKeysFromPublicUrls(publicUrls: UploadedFile[]): UploadedFile[] {
    return publicUrls.map((file) => {
      const fileKey = file.url.split(`https://${this.bucket}.s3.${this.region}.amazonaws.com/`).pop();
      return { name: file.name, url: fileKey || '' };
    });
  }

  public getUrlKeysFromPublicImageUrls(publicUrls: string[]): string[] {
    return sift(publicUrls.map((url) => url.split(`https://${this.bucket}.s3.${this.region}.amazonaws.com/`).pop()));
  }

  public getPublicImageUrls(urlsKey: string[]): string[] {
    return urlsKey.map((key) => `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`);
  }

  public getUploadInfo(fileInfo: FileInfo[]): Promise<UploadInfo>[] {
    return fileInfo.map(async (file) => {
      const { mimeType, fileName, folderPath } = file;
      const { ext, name } = path.parse(fileName);
      const safeName = this.renameFileUploadToS3(name);
      const s3Key = `${folderPath}/${safeName}${ext}`;
      const presignedUrl = await this.getPresignedURLForUpload(s3Key, mimeType);
      const downloadLink = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${s3Key}`;

      return {
        mimeType,
        fileName,
        presignedUrl,
        downloadLink
      };
    });
  }

  public async uploadFileToS3(buffer: Buffer, s3FilePath: string): Promise<DownloadInfo> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: s3FilePath,
      Body: buffer,
      ACL: 'public-read'
    });

    const data = await this.s3Client.send(command);

    return {
      ETag: data.ETag || '',
      ServerSideEncryption: data.ServerSideEncryption || '',
      Location: `https://${this.bucket}.s3.${this.region}.amazonaws.com/${s3FilePath}`
    };
  }
}
