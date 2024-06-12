import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Config } from './config';

const s3ParamsMissing = (config: Config) =>
  !config.aws.bucket || !config.aws.region || !config.aws.accessKey || !config.aws.secretKey;

export class S3Service {
  private s3: S3Client;
  private prefix: string;

  constructor(private readonly config: Config) {
    this.prefix = config.aws.prefix ? config.aws.prefix + '/' : '';

    if (s3ParamsMissing(config)) {
      this.s3 = new S3Client({});
      return;
    }

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

    try {
      const { Body } = await this.s3.send(command);

      if (!Body) {
        return '';
      }

      return Body.transformToString();
    } catch (err) {
      return '';
    }
  }

  async listObjects() {
    if (s3ParamsMissing(this.config)) {
      return {
        listObjects: [],
        prefix: this.prefix,
      };
    }

    const params = {
      Bucket: this.config.aws.bucket,
      Prefix: this.prefix,
    };

    const command = new ListObjectsV2Command(params);

    try {
      const { Contents } = await this.s3.send(command);

      return {
        listObjects: Contents,
        prefix: this.prefix,
      };
    } catch (err) {
      return {
        listObjects: [],
        prefix: this.prefix,
      };
    }
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
