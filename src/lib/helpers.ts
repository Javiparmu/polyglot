import { TranslationMissingFields } from '@/app/store/useTranslationStore';
import { Translation } from './types';

export const formatJson = (json: string, tab = 2): string => {
  try {
    return formatObjectToJSON(JSON.parse(json), tab);
  } catch (e) {
    return json;
  }
};

export const formatObjectToJSON = (object: Record<string, unknown>, tab = 2): string => {
  return JSON.stringify(object, null, tab);
};

export const tryParse = (json: Record<string, string> | string): Record<string, unknown> => {
  try {
    return JSON.parse(json as string);
  } catch (e) {
    return {} as Record<string, unknown>;
  }
};

export const addFieldToJson = (json: string, field: string, value = ''): string => {
  return JSON.stringify(
    {
      [field]: value,
      ...JSON.parse(json),
    },
    null,
    2,
  );
};

export const getMissingTranslations = (
  translations: Record<string, Record<string, string>>,
): Record<string, string[]> => {
  const allTranslations = new Set(Object.values(translations).flatMap(Object.keys));

  const missing = Object.keys(translations).reduce((acc: Record<string, string[]>, lang) => {
    const presentTranslations = new Set(Object.keys(translations[lang]));
    const missingForLang = Array.from(allTranslations).filter((x) => !presentTranslations.has(x));
    acc[lang] = missingForLang;
    return acc;
  }, {});

  return missing;
};

export const getTranslationMissingFields = (translations: Translation): TranslationMissingFields => {
  const languages = Object.keys(translations);
  const missingFields: TranslationMissingFields = {};

  const allCategories = languages.map((lang) => Object.keys(translations[lang]));
  const commonCategories = allCategories.reduce((a, b) => a.filter((c) => b.includes(c)));

  languages.forEach((lang) => {
    missingFields[lang] = {};
    commonCategories.forEach((category) => {
      missingFields[lang][category] = {
        missing: [],
        empty: [],
      };
    });
  });

  languages.forEach((lang) => {
    commonCategories.forEach((category) => {
      const parsedTranslation = tryParse(translations[lang][category] ?? '{}');
      const fields = Object.keys(parsedTranslation);

      languages.forEach((otherLang) => {
        if (lang !== otherLang) {
          const otherParsedTranslation = tryParse(translations[otherLang][category] ?? '{}');

          fields.forEach((key) => {
            const otherField = otherParsedTranslation[key] as string;

            if (otherField == null) {
              missingFields[otherLang][category]?.missing?.push(key);
            } else if (otherField === '') {
              missingFields[otherLang][category]?.empty?.push(key);
            }
          });
        }
      });
    });
  });

  return missingFields;
};

export const isEmpty = (array: unknown[]): boolean => !array || array.length === 0;

export const isEmptyObject = (object: Record<string, unknown>): boolean => !object || Object.keys(object).length === 0;
