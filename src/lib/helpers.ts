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

export const addNestedField = <T = Record<string, unknown>>(json: Record<string, any>, path: string, value = ''): T => {
  const keys = path.split('.');
  let current = json;

  for (let i = 0; i < keys.length; i++) {
    if (i === keys.length - 1) {
      current[keys[i]] = value;
    } else {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
  }

  return { ...json } as T;
};

type PlainObject = { [key: string]: any };

function flattenObject(obj: PlainObject, prefix: string = ''): PlainObject {
  return Object.keys(obj).reduce((acc: PlainObject, k: string): PlainObject => {
    const pre = prefix.length ? prefix + '.' : '';
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      Object.assign(acc, flattenObject(obj[k], pre + k));
    } else {
      acc[pre + k] = obj[k];
    }
    return acc;
  }, {});
}

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

  if (languages.length === 0) return {};

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
      const parsedTranslation = flattenObject(tryParse(translations[lang][category] ?? '{}'));
      const fields = Object.keys(parsedTranslation);

      languages.forEach((otherLang) => {
        if (lang !== otherLang) {
          const otherParsedTranslation = flattenObject(tryParse(translations[otherLang][category] ?? '{}'));

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

export const apiBaseUrl = process.env.API_BASE_URL;
