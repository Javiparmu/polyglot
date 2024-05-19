'use server';

import { defaultConfig } from '@/lib/config';
import { S3Service } from '@/lib/s3';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

export const createTranslation = async (language: string, translation: string, content = '{}') => {
  const cookiesConfig = cookies().get('config')?.value;
  const config = cookiesConfig ? JSON.parse(cookiesConfig) : defaultConfig;

  const s3Service = new S3Service(config);

  await s3Service.putObject(`${language}/${translation}.json`, content);

  revalidateTag('translations');
};
