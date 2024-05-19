import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Config } from './config';

export class S3Service {
  private s3: S3Client;
  private prefix: string;

  constructor(private readonly config: Config) {
    this.prefix = config.aws.prefix ? config.aws.prefix + '/' : '';

    this.s3 = new S3Client({
      region: config.aws.region,
      credentials: {
        accessKeyId: config.aws.accessKey,
        secretAccessKey: config.aws.secretKey,
      },
    });
  }

  async putObject(key: string, content: string) {
    const params = {
      Bucket: this.config.aws.bucket,
      Key: this.prefix + key,
      Body: content,
    };

    const command = new PutObjectCommand(params);

    return this.s3.send(command);
  }

  async getObject(key: string) {
    const params = {
      Bucket: this.config.aws.bucket,
      Key: this.prefix + key,
    };

    const command = new GetObjectCommand(params);

    const { Body } = await this.s3.send(command);

    if (!Body) {
      return '';
    }

    return Body.transformToString();
  }

  async listObjects() {
    if (!this.config.aws.bucket) {
      return [];
    }

    const params = {
      Bucket: this.config.aws.bucket,
      Prefix: this.prefix,
    };

    const command = new ListObjectsV2Command(params);

    const { Contents } = await this.s3.send(command);

    return Contents;
  }

  async copyObject(sourceKey: string, destinationKey: string) {
    const params = {
      Bucket: this.config.aws.bucket,
      CopySource: this.config.aws.bucket + '/' + this.prefix + sourceKey,
      Key: this.prefix + destinationKey,
    };

    const command = new CopyObjectCommand(params);

    return this.s3.send(command);
  }

  async deleteObject(key: string) {
    const params = {
      Bucket: this.config.aws.bucket,
      Key: this.prefix + key,
    };

    const command = new DeleteObjectCommand(params);

    return this.s3.send(command);
  }
}
