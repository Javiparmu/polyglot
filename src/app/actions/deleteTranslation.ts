'use server';

import { apiFetch } from '@/lib/helpers';

export const deleteTranslation = async (language: string, translation: string): Promise<void> => {
  await apiFetch<string>('/translations', {
    method: 'DELETE',
    body: JSON.stringify({ language, translation }),
  });
};
