'use server';

import { apiFetch } from '@/lib/helpers';
import { revalidateTag } from 'next/cache';

export const generateTranslation = async (
  oldLanguage: string,
  newLanguage: string,
  translation: string,
  options?: { context?: string; translateKeys?: boolean },
): Promise<void> => {
  await apiFetch<string>('/translations/generate', {
    method: 'POST',
    body: JSON.stringify({ oldLanguage, newLanguage, translation, options }),
  });

  revalidateTag('translations');
};
