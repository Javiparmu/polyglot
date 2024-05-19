'use server';

import { S3Service } from '@/lib/s3';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

const s3Service = new S3Service(JSON.parse(cookies().get('config')?.value || '{}'));

export const deleteTranslation = async (language: string, translation: string): Promise<void> => {
  await s3Service.deleteObject(`${language}/${translation}.json`);

  revalidateTag('translations');
};
