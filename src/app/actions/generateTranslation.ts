'use server';

import { apiFetch } from '@/lib/helpers';

export const generateTranslation = async (
  oldLanguage: string,
  newLanguage: string,
  translation: string,
): Promise<void> => {
  await apiFetch<string>('/translations/generate', {
    method: 'POST',
    body: JSON.stringify({ oldLanguage, newLanguage, translation }),
  });
};
