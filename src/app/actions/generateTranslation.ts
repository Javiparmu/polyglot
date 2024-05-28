'use server';

import { Config, defaultConfig } from '@/lib/config';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

export const generateTranslation = async (
  oldLanguage: string,
  newLanguage: string,
  translation: string,
  options?: { context?: string; translateKeys?: boolean },
): Promise<void> => {
  const cookiesConfig = cookies().get('config')?.value;
  const config: Config = cookiesConfig ? JSON.parse(cookiesConfig) : defaultConfig;

  await fetch(process.env.BASE_URL + '/api/translations/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ oldLanguage, newLanguage, translation, options, config }),
    cache: 'no-cache',
  });

  revalidateTag('translations');
};
