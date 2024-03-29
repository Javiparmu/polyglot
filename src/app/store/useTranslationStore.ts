import { formatObjectToJSON, getMissingTranslations, getTranslationMissingFields } from '@/lib/helpers';
import { Translation } from '@/lib/types';
import { create } from 'zustand';
import { tryParse } from '@/lib/helpers';

type TranslationStore = {
  translations: Translation;
  languages: string[];
  selectedTranslation: { language: string; translation: string };
  missingTranslations: Record<string, string[]>;
  missingFields: Record<string, Record<string, string[]>>;
  updateTranslations: (translations: Translation) => void;
  addTranslation: (language: string, translation: Record<string, string>) => void;
  addFieldToTranslation: (language: string, translation: string, field: string) => void;
  setSelectedTranslation: (selected: { language: string; translation: string }) => void;
};

export const useTranslationStore = create<TranslationStore>()((set) => ({
  translations: {},
  languages: [],
  selectedTranslation: { language: '', translation: '' },
  missingTranslations: {},
  missingFields: {},
  updateTranslations: (translations) =>
    set({
      translations,
      languages: Object.keys(translations),
      missingTranslations: getMissingTranslations(translations),
      missingFields: getTranslationMissingFields(translations),
    }),
  addTranslation: (language, translation) =>
    set((state) => {
      const newTranslations = {
        ...state.translations,
        [language]: {
          ...state.translations[language],
          ...translation,
        },
      };

      return {
        translations: newTranslations,
        languages: Array.from(new Set([...state.languages, language])),
        missingTranslations: getMissingTranslations(newTranslations),
        missingFields: getTranslationMissingFields(newTranslations),
      };
    }),
  addFieldToTranslation: (language, translation, field) =>
    set((state) => {
      const newTranslations = {
        ...state.translations,
        [language]: {
          ...state.translations[language],
          [translation]: formatObjectToJSON({
            [field]: '',
            ...tryParse(state.translations[language][translation]),
          }),
        },
      };

      return {
        translations: newTranslations,
        languages: Array.from(new Set([...state.languages, language])),
        missingTranslations: getMissingTranslations(newTranslations),
        missingFields: getTranslationMissingFields(newTranslations),
      };
    }),
  setSelectedTranslation: (selected) => set({ selectedTranslation: selected }),
}));