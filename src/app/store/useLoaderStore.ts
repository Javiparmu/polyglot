import { isDeepStrictEqual } from 'util';
import { createWithEqualityFn } from 'zustand/traditional';

type LoaderStore = {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
};

export const useLoaderStore = createWithEqualityFn<LoaderStore>(
  (set) => ({
    isLoading: false,
    setIsLoading: (value) =>
      set((state) => ({
        isLoading: value,
      })),
  }),
  isDeepStrictEqual,
);
