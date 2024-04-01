'use client';

import React, { useRef, useState } from 'react';
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
import { useTranslationStore } from '@/app/store/useTranslationStore';
import Flag from './flag';
import { useTranslationUpload } from '@/app/hooks/useTranslationUpload';

const Navbar = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');

  const { languages } = useTranslationStore();
  const { onMultipleTranslationsChange } = useTranslationUpload({});

  const onTranslationUpload = (language: string) => {
    setSelectedLanguage(language);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  return (
    <header className="hidden lg:flex h-[60px] items-center justify-between border-b px-6">
      <div className="flex items-center gap-2 font-semibold">
        <Logo className="h-8 w-8 stroke-red-500" />
        <span className="">Translation Checker</span>
      </div>
      <div className="flex items-center gap-8">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
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
        <Button className="bg-blue-600 hover:bg-blue-500 text-base px-6">Update</Button>
      </div>
    </header>
  );
};

export default Navbar;
