'use server';

import { Translation } from '@/lib/types';

export const updateTranslations = async (translations: Translation) => {
  const response = await fetch('/api/translations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ translations }),
  });

  if (!response.ok) {
    throw new Error('Failed to update translations');
  }
};
