import { NextRequest, NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command, GetObjectCommand, _Object } from '@aws-sdk/client-s3';
import { formatJson } from '@/lib/helpers';
import pLimit from 'p-limit';

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

  const limit = pLimit(Number(process.env.S3_DOWNLOAD_CONCURRENCY) ?? 10);

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
  const limit = pLimit(Number(process.env.S3_UPLOAD_CONCURRENCY) ?? 10);

  await Promise.all(
    Object.entries(translations).map(([language, translation]) =>
      limit(async () => {
        await s3.send(
          new GetObjectCommand({
            Bucket: process.env.S3_TRANSLATIONS_BUCKET,
            Key: `${process.env.S3_TRANSLATIONS_KEY}${language}.json`,
          }),
        );
      }),
    ),
  );

  await Promise.all(
    Object.entries(translations).map(([language, translation]) =>
      limit(async () => {
        await s3.send(
          new GetObjectCommand({
            Bucket: process.env.S3_TRANSLATIONS_BUCKET,
            Key: `${process.env.S3_TRANSLATIONS_KEY}${language}.json`,
          }),
        );
      }),
    ),
  );

  return NextResponse.json({ message: 'Translations updated' });
}
