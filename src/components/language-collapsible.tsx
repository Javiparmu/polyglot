'use client';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Button } from './ui/button';
import { CaretSortIcon, UploadIcon } from '@radix-ui/react-icons';
import Flag from './flag';
import { useTranslationStore } from '@/app/store/useTranslationStore';
import { useTranslationUpload } from '@/app/hooks/useTranslationUpload';
import { isEmpty } from '@/lib/helpers';
import { useMemo, useRef } from 'react';
import { EllipsisVerticalIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { deleteTranslation } from '@/app/actions/deleteTranslation';
import { successToast } from '@/lib/toasts';

interface LanguageCollapsibleProps {
  language: string;
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}

const LanguageCollapsible = ({ language, isOpen, onToggle }: LanguageCollapsibleProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { translations, missingTranslations, missingFields, setSelectedTranslation } = useTranslationStore();
  const { onTranslationChange } = useTranslationUpload({});

  const missing = useMemo(() => missingFields?.[language] || {}, [language, missingFields]);

  const onTranslationUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const onTranslationDelete = async (language: string, translation: string) => {
    try {
      await deleteTranslation(language, translation);
      successToast('Translation deleted');
    } catch (error) {
      errorToast('Failed to delete translation');
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={(open) => onToggle(open)} defaultOpen className="space-y-2">
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="flex items-center gap-2 text-base font-semibold">
          <Flag language={language} className="w-4 h-4" />
          {language}
        </h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <CaretSortIcon className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="">
        {Object.keys(translations[language])
          .sort()
          .map((translation) => (
            <Button
              key={translation}
              variant="ghost"
              size="sm"
              onClick={() =>
                setSelectedTranslation({
                  language,
                  translation,
                })
              }
              className={`
                group flex w-full justify-between pl-6 ${missingTranslations[language].includes(translation) ? 'text-red-500' : ''}
                ${!isEmpty(missing[translation]?.empty) || !isEmpty(missing[translation]?.missing) ? 'text-orange-400' : ''}
              `}
            >
              {translation}
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="outline-none">
                  <EllipsisVerticalIcon className="h-4 w-4 text-transparent group-hover:text-gray-400 hover:text-gray-500" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onTranslationDelete(language, translation);
                    }}
                    className="flex items-center justify-between text-slate-500 hover:text-slate-700 cursor-pointer"
                  >
                    Delete
                    <Trash2Icon className="h-4 w-4" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Button>
          ))}
        {missingTranslations[language]?.map((translation) => (
          <div key={language + translation} className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTranslationUpload()}
              className="group flex w-full justify-between pl-6 text-red-500 hover:bg-red-100 hover:text-red-700"
            >
              {translation}
              <UploadIcon className="h-4 w-4 ml-2 text-transparent group-hover:text-red-700 transition-all duration-300" />
            </Button>
            <input
              ref={fileInputRef}
              accept=".json"
              type="file"
              className="hidden"
              onChange={(e) => onTranslationChange(e, { language, translation })}
            />
          </div>
        ))}
        <AddTranslationButton language={language} />
      </CollapsibleContent>
    </Collapsible>
  );
};

const AddTranslationButton = ({ language }: { language: string }) => {
  const { addTranslation } = useTranslationStore();

  const onAddTranslation = () => {
    addTranslation(language, { 'New translation': '' });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onAddTranslation}
      className="group flex w-full items-center justify-center h-7"
    >
      <PlusIcon className="h-4 w-4 text-blue-600 group-hover:text-blue-500" />
    </Button>
  );
};

export default LanguageCollapsible;
