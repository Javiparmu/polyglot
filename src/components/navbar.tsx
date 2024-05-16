'use client';

import React, { useMemo, useRef, useState } from 'react';
import { Logo } from './icons';
import { Button } from './ui/button';
import { UploadIcon } from '@radix-ui/react-icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { useTranslationStore } from '@/app/store/useTranslationStore';
import Flag from './flag';
import { useTranslationUpload } from '@/app/hooks/useTranslationUpload';
import { updateTranslations } from '@/app/actions/updateTranslations';
import { errorToast, successToast } from '@/lib/toasts';
import { SettingsIcon } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';

const Navbar = () => {
  const [loading, setLoading] = useState(false);
  const languages = useTranslationStore((state) => state.languages);
  const missingFields = useTranslationStore((state) => state.missingFields);
  const missingTranslations = useTranslationStore((state) => state.missingTranslations);

  const canUpdate = useMemo(
    () => Object.keys(missingFields).length === 0 && Object.keys(missingTranslations).length === 0,
    [missingFields, missingTranslations],
  );

  const onUpdateTranslations = async () => {
    const translations = useTranslationStore.getState().translations;

    setLoading(true);

    try {
      await updateTranslations(translations);

      successToast('Translations updated');
    } catch (error) {
      errorToast('Failed to update translations');
    }

    setLoading(false);
  };

  return (
    <header className="hidden lg:flex h-[60px] items-center justify-between border-b px-6">
      <div className="flex items-center gap-2 font-semibold">
        <Logo className="h-8 w-8 stroke-red-500" />
        <span className="">Translation Checker</span>
      </div>
      <div className="flex items-center gap-8">
        <SettingsDrawer />
        <UploadTranslationsButton languages={languages} />
        {canUpdate ? (
          <Button
            disabled={loading}
            onClick={onUpdateTranslations}
            className="bg-blue-600 hover:bg-blue-500 text-base px-6"
          >
            Update
          </Button>
        ) : (
          <UploadTranslationsModal onConfirm={onUpdateTranslations} />
        )}
      </div>
    </header>
  );
};

const UploadTranslationsButton = ({ languages }: { languages: string[] }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');

  const { onMultipleTranslationsChange } = useTranslationUpload({});

  const onTranslationUpload = (language: string) => {
    setSelectedLanguage(language);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="outline-none">
          <Button variant="outline" className="text-base px-4 gap-2">
            <UploadIcon className="h-4 w-4" />
            Upload
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="text-slate-600">Languages</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {languages.map((language) => (
            <DropdownMenuItem
              key={language}
              onClick={() => onTranslationUpload(language)}
              className="flex items-center justify-between w-full text-slate-500 hover:text-slate-700 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Flag language={language} className="w-4 h-4" />
                {language}
              </div>
              <UploadIcon className="w-4 h-4" />
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <input
        ref={fileInputRef}
        accept=".json"
        type="file"
        className="hidden"
        onChange={(e) => onMultipleTranslationsChange(e, selectedLanguage)}
        multiple
      />
    </>
  );
};

const UploadTranslationsModal = ({ onConfirm }: { onConfirm: () => void }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-500 text-base px-6">Update</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-xl">There are missing translations or fields</DialogTitle>
          <DialogDescription className="text-base">Are you sure you want to continue updating?</DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start mt-4">
          <DialogClose asChild>
            <Button onClick={onConfirm} className="bg-blue-600 hover:bg-blue-500" type="submit">
              Update
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const SettingsDrawer = () => {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <SettingsIcon className="h-5 w-5 text-gray-600" />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Configuration</DrawerTitle>
          <DrawerDescription>Set up all your config to unlock full potential.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default Navbar;
