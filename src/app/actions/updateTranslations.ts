'use server';

import { Translation } from '@/lib/types';
import { apiFetch } from '@/lib/helpers';

export const updateTranslations = async (translations: Translation) => {
  await apiFetch<Translation>('/translations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ translations }),
    errorMessage: 'Failed to update translations',
  });
};
