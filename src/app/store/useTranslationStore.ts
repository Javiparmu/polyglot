import { formatObjectToJSON, getMissingTranslations, getTranslationMissingFields } from '@/lib/helpers';
import { Translation } from '@/lib/types';
import { tryParse } from '@/lib/helpers';
import { createWithEqualityFn } from 'zustand/traditional';
import { isDeepStrictEqual } from 'util';

export type TranslationMissingFields = Record<string, Record<string, { missing: string[]; empty: string[] }>>;

type TranslationStore = {
  translations: Translation;
  languages: string[];
  selectedTranslation: { language: string; translation: string };
  missingTranslations: Record<string, string[]>;
  missingFields: TranslationMissingFields;
  updateTranslations: (translations: Translation) => void;
  addTranslation: (language: string, translation: Record<string, string>) => void;
  addFieldToTranslation: (language: string, translation: string, field: string) => void;
  deleteTranslation: (language: string, translation: string) => void;
  setSelectedTranslation: (selected: { language: string; translation: string }) => void;
};

export const useTranslationStore = createWithEqualityFn<TranslationStore>(
  (set) => ({
    translations: {},
    languages: [],
    selectedTranslation: { language: '', translation: '' },
    missingTranslations: {},
    missingFields: {},
    updateTranslations: (translations) =>
      set((state) => {
        const newLanguages = Object.keys(translations ?? {});

        return {
          translations,
          languages: newLanguages,
          missingTranslations: getMissingTranslations(translations),
          missingFields: getTranslationMissingFields(translations),
        };
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
          missingTranslations: getMissingTranslations(newTranslations),
          missingFields: getTranslationMissingFields(newTranslations),
        };
      }),
    addFieldToTranslation: (language, translation, field) =>
      set((state) => {
        const newTranslations = { ...state.translations };
        if (!newTranslations[language]) {
          newTranslations[language] = {};
        }

        const newTranslation = {
          [field]: '',
          ...tryParse(newTranslations[language][translation]),
        };

        newTranslations[language][translation] = formatObjectToJSON(newTranslation);

        return {
          translations: newTranslations,
          missingFields: getTranslationMissingFields(newTranslations),
        };
      }),
    deleteTranslation: (language, translation) =>
      set((state) => {
        const newTranslations = { ...state.translations };
        delete newTranslations[language][translation];

        return {
          translations: newTranslations,
          missingTranslations: getMissingTranslations(newTranslations),
          missingFields: getTranslationMissingFields(newTranslations),
        };
      }),
    setSelectedTranslation: (selected) => set({ selectedTranslation: selected }),
  }),
  isDeepStrictEqual,
);
