'use server';

import { Translation } from '@/lib/types';
import { formatJson } from '@/lib/helpers';
import { revalidateTag } from 'next/cache';
import pLimit from 'p-limit';
import { CopyObjectCommand, DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const defaultConcurrency = 10;

const s3 = new S3Client({ region: process.env.AWS_REGION });

export const updateTranslations = async (translations: Translation) => {
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

  revalidateTag('translations');
};

export const updateTranslationName = async (language: string, oldName: string, newName: string) => {
  const copyObjectParams = {
    Bucket: process.env.S3_TRANSLATIONS_BUCKET,
    CopySource: `${process.env.S3_TRANSLATIONS_BUCKET}/${language}/${oldName}.json`,
    Key: `${language}/${newName}.json`,
  };

  await s3.send(new CopyObjectCommand(copyObjectParams));

  const deleteObjectParams = {
    Bucket: process.env.S3_TRANSLATIONS_BUCKET,
    Key: `${language}/${oldName}.json`,
  };

  await s3.send(new DeleteObjectCommand(deleteObjectParams));

  revalidateTag('translations');

  return newName;
};
