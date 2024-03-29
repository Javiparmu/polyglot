import { formatJson } from '@/lib/helpers';
import { errorToast } from '@/lib/toasts';
import { useRef } from 'react';
import { useTranslationStore } from '../store/useTranslationStore';

interface FileUploadProps {
  onSuccess?: () => void;
  onError?: () => void;
}

export const useTranslationUpload = (language: string, { onSuccess, onError }: FileUploadProps) => {
  const { addTranslation } = useTranslationStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onTranslationUpload = () => {
    fileInputRef.current?.click();
  };

  const onTranslationChange = async (event: React.ChangeEvent<HTMLInputElement>, translation: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const translationName = file.name.replace('.json', '');

    if (translationName !== translation) {
      errorToast('Invalid translation name');
      return;
    }

    const translationData = await file.text();

    try {
      addTranslation(language, {
        [translationName]: formatJson(translationData),
      });
      onSuccess?.();
    } catch (error) {
      onError ? onError() : errorToast('Invalid JSON file');
    }
  };

  return { onTranslationUpload, onTranslationChange, fileInputRef };
};
