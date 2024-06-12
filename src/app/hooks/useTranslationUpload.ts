import { formatJson } from '@/lib/helpers';
import { errorToast } from '@/lib/toasts';
import { useTranslationStore } from '../store/useTranslationStore';
import { createTranslation } from '../actions/createTranslation';

interface FileUploadProps {
  onSuccess?: () => void;
  onError?: () => void;
}

export const useTranslationUpload = ({ onSuccess, onError }: FileUploadProps) => {
  const addTranslation = useTranslationStore((state) => state.addTranslation);

  const onTranslationChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    { language, translation }: { language?: string; translation?: string },
  ) => {
    if (!language || !translation) {
      errorToast('Invalid language or translation');
      return;
    }

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
      await createTranslation(language, translationName, translationData);
      onSuccess?.();
    } catch (error) {
      onError ? onError() : errorToast('Error uploading translation');
    }
  };

  const onMultipleTranslationsChange = async (event: React.ChangeEvent<HTMLInputElement>, language: string) => {
    const files = event.target.files;
    if (!files) return;

    try {
      Array.from(files).forEach(async (file) => {
        const translationName = file.name.replace('.json', '');
        const translationData = await file.text();

        addTranslation(language, {
          [translationName]: formatJson(translationData),
        });
        await createTranslation(language, translationName, translationData);
      });
      onSuccess?.();
    } catch (error) {
      onError ? onError() : errorToast('Error uploading translations');
    }
  };

  return { onTranslationChange, onMultipleTranslationsChange };
};
