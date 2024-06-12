import { isDeepStrictEqual } from 'util';
import { createWithEqualityFn } from 'zustand/traditional';

type TargetLanguage = string;

type ResizableStore = {
  open: {
    [language: string]: {
      [translationName: string]: TargetLanguage;
    };
  };
  setOpen: (language: string, targetLanguage: TargetLanguage, translationName: string, value: boolean) => void;
};

export const useResizableStore = createWithEqualityFn<ResizableStore>(
  (set) => ({
    open: {},
    setOpen: (language, targetLanguage, translationName, value) =>
      set(() => {
        if (!value) {
          return {
            open: {},
          };
        }

        return {
          open: {
            [language]: {
              [translationName]: targetLanguage,
            },
          },
        };
      }),
  }),
  isDeepStrictEqual,
);
