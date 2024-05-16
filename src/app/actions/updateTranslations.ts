'use server';

import { Translation } from '@/lib/types';
import { apiFetch } from '@/lib/helpers';
import { revalidateTag } from 'next/cache';

export const updateTranslations = async (translations: Translation) => {
  await apiFetch<Translation>('/translations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ translations }),
    errorMessage: 'Failed to update translations',
  });

  revalidateTag('translations');
};

export const updateTranslationName = async (language: string, oldName: string, newName: string) => {
  await apiFetch('/translations/name', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ language, oldName, newName }),
    errorMessage: 'Failed to update translation name',
  });

  revalidateTag('translations');

  return newName;
};
