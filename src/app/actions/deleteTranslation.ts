'use server';

import { S3Service } from '@/lib/s3';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

export const deleteTranslation = async (language: string, translation: string): Promise<void> => {
  const config = JSON.parse(cookies().get('config')?.value || '{}');

  const s3Service = new S3Service(config);

  await s3Service.deleteObject(`${language}/${translation}.json`);

  revalidateTag('translations');
};
