'use server';

import { S3Service } from '@/lib/s3';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

const s3Service = new S3Service(JSON.parse(cookies().get('config')?.value || '{}'));

export const createTranslation = async (language: string, translation: string, content = '{}') => {
  await s3Service.putObject(`${language}/${translation}.json`, content);

  revalidateTag('translations');
};
