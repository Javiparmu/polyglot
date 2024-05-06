import { NextRequest, NextResponse } from 'next/server';
import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  _Object,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { formatJson } from '@/lib/helpers';
import pLimit from 'p-limit';

const defaultConcurrency = 10;

const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function GET(req: NextRequest): Promise<NextResponse> {
  const listObjects = new ListObjectsV2Command({
    Bucket: process.env.S3_TRANSLATIONS_BUCKET,
    Prefix: process.env.S3_TRANSLATIONS_KEY,
  });

  const { Contents } = await s3.send(listObjects);

  if (!Contents) {
    return NextResponse.json({ message: 'No translations found' });
  }

  let translations = {} as any;

  const limit = pLimit(
    process.env.S3_DOWNLOAD_CONCURRENCY ? Number(process.env.S3_DOWNLOAD_CONCURRENCY) : defaultConcurrency,
  );

  await Promise.all(
    Contents.map((file) =>
      limit(async () => {
        const getObjectParams = {
          Bucket: process.env.S3_TRANSLATIONS_BUCKET,
          Key: file.Key,
        };
        const { Body } = await s3.send(new GetObjectCommand(getObjectParams));

        if (!Body || !file.Key) {
          return;
        }

        let translationData = '';
        for await (const chunk of Body as unknown as string) {
          translationData += chunk;
        }

        if (!translationData) {
          return;
        }

        translations = {
          ...translations,
          [file.Key.split('/')[0]]: {
            ...translations[file.Key.split('/')[0]],
            [file.Key.split('/')[1].split('.')[0]]: formatJson(translationData),
          },
        };
      }),
    ),
  );

  return NextResponse.json({ translations });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { translations } = await req.json();

  const limit = pLimit(
    process.env.S3_UPLOAD_CONCURRENCY ? Number(process.env.S3_UPLOAD_CONCURRENCY) : defaultConcurrency,
  );

  await Promise.all(
    Object.keys(translations).map((language) =>
      limit(async () => {
        await Promise.all(
          Object.keys(translations[language]).map((translation) => {
            const putObjectParams = {
              Bucket: process.env.S3_TRANSLATIONS_BUCKET,
              Key: `${language}/${translation}.json`,
              Body: formatJson(translations[language][translation]),
            };

            const command = new PutObjectCommand(putObjectParams);

            return s3.send(command);
          }),
        );
      }),
    ),
  );

  return NextResponse.json({ message: 'Translations updated' });
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  const { language, translation } = await req.json();

  console.log(language, translation);

  const deleteObjectParams = {
    Bucket: process.env.S3_TRANSLATIONS_BUCKET,
    Key: `${language}/${translation}.json`,
  };

  await s3.send(new DeleteObjectCommand(deleteObjectParams));

  return NextResponse.json({ message: 'Translation deleted' });
}
