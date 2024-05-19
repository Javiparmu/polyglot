'use server';

import { defaultConfig } from '@/lib/config';
import { S3Service } from '@/lib/s3';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

export const deleteTranslation = async (language: string, translation: string): Promise<void> => {
  const cookiesConfig = cookies().get('config')?.value;
  const config = cookiesConfig ? JSON.parse(cookiesConfig) : defaultConfig;

  const s3Service = new S3Service(config);

  await s3Service.deleteObject(`${language}/${translation}.json`);

  revalidateTag('translations');
};
