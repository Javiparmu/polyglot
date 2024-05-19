import { defaultConfig } from '@/lib/config';
import { formatJson } from '@/lib/helpers';
import { S3Service } from '@/lib/s3';
import { Translation } from '@/lib/types';
import { cookies } from 'next/headers';
import pLimit from 'p-limit';

const defaultConcurrency = 10;

export const getTranslations = async (): Promise<Translation> => {
  const cookiesConfig = cookies().get('config')?.value;
  const config = cookiesConfig ? JSON.parse(cookiesConfig) : defaultConfig;

  const s3Service = new S3Service(config);
  const listObjects = await s3Service.listObjects();

  if (!listObjects || listObjects.length === 0) {
    return {} as Translation;
  }

  let translations = {} as any;

  const limit = pLimit(
    process.env.S3_DOWNLOAD_CONCURRENCY ? Number(process.env.S3_DOWNLOAD_CONCURRENCY) : defaultConcurrency,
  );

  await Promise.all(
    listObjects.map((file) =>
      limit(async () => {
        if (!file.Key) {
          return;
        }

        const translationData = await s3Service.getObject(file.Key);

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

  return translations;
};
