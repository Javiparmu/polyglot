'use server';

import { Translation } from '@/lib/types';
import { formatJson } from '@/lib/helpers';
import { revalidateTag } from 'next/cache';
import pLimit from 'p-limit';
import { S3Service } from '@/lib/s3';
import { cookies } from 'next/headers';

const defaultConcurrency = 10;

const s3Service = new S3Service(JSON.parse(cookies().get('config')?.value || '{}'));

export const updateTranslations = async (translations: Translation) => {
  const limit = pLimit(
    process.env.S3_UPLOAD_CONCURRENCY ? Number(process.env.S3_UPLOAD_CONCURRENCY) : defaultConcurrency,
  );

  await Promise.all(
    Object.keys(translations).map((language) =>
      limit(async () => {
        await Promise.all(
          Object.keys(translations[language]).map((translation) => {
            return s3Service.putObject(
              `${language}/${translation}.json`,
              formatJson(translations[language][translation]),
            );
          }),
        );
      }),
    ),
  );

  revalidateTag('translations');
};

export const updateTranslationName = async (language: string, oldName: string, newName: string) => {
  await s3Service.copyObject(`${language}/${oldName}.json`, `${language}/${newName}.json`);

  await s3Service.deleteObject(`${language}/${oldName}.json`);

  revalidateTag('translations');

  return newName;
};
