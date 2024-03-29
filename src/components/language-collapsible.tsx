'use client';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Button } from './ui/button';
import { CaretSortIcon, UploadIcon } from '@radix-ui/react-icons';
import Flag from './flag';
import { useTranslationStore } from '@/app/store/useTranslationStore';
import { useTranslationUpload } from '@/app/hooks/useTranslationUpload';
import { isEmpty } from '@/lib/helpers';

interface LanguageCollapsibleProps {
  language: string;
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}

const LanguageCollapsible = ({ language, isOpen, onToggle }: LanguageCollapsibleProps) => {
  const { translations, missingTranslations, missingFields, setSelectedTranslation } = useTranslationStore();

  const { fileInputRef, onTranslationUpload, onTranslationChange } = useTranslationUpload(language, {});

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
      <CollapsibleContent className="space-y-2">
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
              className={`flex w-full justify-start pl-6 ${missingTranslations[language].includes(translation) ? 'text-red-500' : ''} ${!isEmpty(missingFields[language][translation]) ? 'text-orange-400' : ''}`}
            >
              {translation}
            </Button>
          ))}
        {missingTranslations[language]?.map((translation) => (
          <div key={translation} className="flex items-center justify-between">
            <Button
              key={translation}
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
              onChange={(e) => onTranslationChange(e, translation)}
              onClick={(e) => (e.currentTarget.value = '')}
            />
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default LanguageCollapsible;
