import { isDeepStrictEqual } from 'util';
import { createWithEqualityFn } from 'zustand/traditional';

export enum Dialogs {
  AddTranslation = 'AddTranslation',
  DeleteTranslation = 'DeleteTranslation',
  UploadTranslation = 'UploadTranslation',
  GenerateTranslation = 'GenerateTranslation',
}

type DialogStore = {
  open: {
    [Dialogs.AddTranslation]: boolean;
    [Dialogs.DeleteTranslation]: boolean;
    [Dialogs.UploadTranslation]: boolean;
    [Dialogs.GenerateTranslation]: boolean;
  };
  setOpen: (key: string, value: boolean) => void;
};

export const useDialogStore = createWithEqualityFn<DialogStore>(
  (set) => ({
    open: {
      [Dialogs.AddTranslation]: false,
      [Dialogs.DeleteTranslation]: false,
      [Dialogs.UploadTranslation]: false,
      [Dialogs.GenerateTranslation]: false,
    },
    setOpen: (key, value) =>
      set((state) => ({
        open: {
          ...state.open,
          [key]: value,
        },
      })),
  }),
  isDeepStrictEqual,
);
