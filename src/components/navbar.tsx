'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { Moon, SaveAllIcon, SettingsIcon, Sun } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { addNestedField } from '@/lib/helpers';
import { setCookies } from '@/app/actions/setCookies';
import { getCookies } from '@/app/actions/getCookies';
import { Config, defaultConfig } from '@/lib/config';
import { useTheme } from 'next-themes';

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
        <Logo className="h-8 w-8 stroke-accent-hover dark:stroke-blue-300" />
        <span className="">Translation Checker</span>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <SettingsDrawer />
        <UploadTranslationsButton languages={languages} />
        {canUpdate ? (
          <Button
            disabled={loading}
            onClick={onUpdateTranslations}
            className="bg-accent hover:bg-accent-hover dark:bg-blue-400 dark:hover:bg-blue-300 text-base px-6"
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
              className="flex items-center justify-between w-full text-primary-light hover:text-primary-light-hover cursor-pointer"
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
        <Button className="bg-accent hover:bg-accent-hover dark:bg-blue-400 dark:hover:bg-blue-300 text-base px-6">
          Update
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-xl">There are missing translations or fields</DialogTitle>
          <DialogDescription className="text-base">Are you sure you want to continue updating?</DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start mt-4">
          <DialogClose asChild>
            <Button
              onClick={onConfirm}
              className="bg-accent hover:bg-accent-hover dark:bg-blue-400 dark:hover:bg-blue-300"
              type="submit"
            >
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
  const [config, setConfig] = useState<Config>(defaultConfig);

  useEffect(() => {
    getCookies('config').then((res) => {
      if (res) {
        setConfig(JSON.parse(res));
      }
    });
  }, []);

  const onSave = async () => {
    await setCookies('config', JSON.stringify(config));

    successToast('Configuration saved', 'bottom-left');
  };

  const onConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const updatedConfig = addNestedField<Config>(config, name, value);

    setConfig(updatedConfig);
  };

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <SettingsIcon className="h-5 w-5 text-primary-light hover:text-primary-light-hover cursor-pointer" />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Configuration</DrawerTitle>
          <DrawerDescription>Set up all your configurations.</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col p-4 gap-4">
          <span>
            <Label>AWS Access Key</Label>
            <Input
              name="aws.accessKey"
              value={config.aws.accessKey}
              onChange={onConfigChange}
              type="password"
              placeholder="Access Key"
            />
          </span>
          <span>
            <Label>AWS Secret Key</Label>
            <Input
              name="aws.secretKey"
              value={config.aws.secretKey}
              onChange={onConfigChange}
              type="password"
              placeholder="Secret Key"
            />
          </span>
          <span>
            <Label>AWS Region</Label>
            <Input
              name="aws.region"
              value={config.aws.region}
              onChange={onConfigChange}
              type="password"
              placeholder="Region"
            />
          </span>
          <span>
            <Label>AWS Bucket</Label>
            <Input
              name="aws.bucket"
              value={config.aws.bucket}
              onChange={onConfigChange}
              type="password"
              placeholder="Bucket"
            />
          </span>
          <span>
            <Label>AWS Prefix</Label>
            <Input
              name="aws.prefix"
              value={config.aws.prefix}
              onChange={onConfigChange}
              type="password"
              placeholder="Prefix"
            />
          </span>
          <span>
            <Label>OpenAI API Key</Label>
            <Input
              name="openai.apiKey"
              value={config.openai.apiKey}
              onChange={onConfigChange}
              type="password"
              placeholder="API Key"
            />
          </span>
          <span>
            <Label>OpenAI Project ID</Label>
            <Input
              name="openai.projectId"
              value={config.openai.projectId}
              onChange={onConfigChange}
              type="password"
              placeholder="Project ID"
            />
          </span>
        </div>
        <DrawerFooter>
          <Button onClick={onSave} className="gap-2" variant="outline">
            <SaveAllIcon className="h-4 w-4" />
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const onToggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button onClick={onToggleTheme} variant="outline" size="icon">
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default Navbar;
