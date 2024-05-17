'use client';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Button } from './ui/button';
import { CaretSortIcon, UploadIcon } from '@radix-ui/react-icons';
import Flag from './flag';
import { useTranslationStore } from '@/app/store/useTranslationStore';
import { useTranslationUpload } from '@/app/hooks/useTranslationUpload';
import { isEmpty } from '@/lib/helpers';
import { useCallback, useMemo, useRef, useState } from 'react';
import { InfoIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { deleteTranslation } from '@/app/actions/deleteTranslation';
import { errorToast, successToast } from '@/lib/toasts';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { generateTranslation } from '@/app/actions/generateTranslation';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Dialogs, useDialogStore } from '@/app/store/useDialogStore';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { useLoaderStore } from '@/app/store/useLoaderStore';
import { createTranslation } from '@/app/actions/createTranslation';

interface LanguageCollapsibleProps {
  language: string;
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}

const LanguageCollapsible = ({ language, isOpen, onToggle }: LanguageCollapsibleProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { setOpen } = useDialogStore();
  const { setIsLoading } = useLoaderStore();

  const { languages, translations, missingTranslations, missingFields, setSelectedTranslation } = useTranslationStore();
  const { onTranslationChange } = useTranslationUpload({});

  const missing = useMemo(() => missingFields?.[language] || {}, [language, missingFields]);

  const onTranslationUpload = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  }, [fileInputRef]);

  const onTranslationDelete = async (language: string, translation: string) => {
    try {
      await deleteTranslation(language, translation);
      successToast('Translation deleted');
    } catch (error) {
      errorToast('Failed to delete translation');
    }
  };

  const onGenerateTranslation = async (
    translation: string,
    options?: { context?: string; translateKeys?: boolean },
  ) => {
    const fromLanguage = languages.find((lang) => !!translations[lang][translation]);

    if (!fromLanguage) {
      errorToast('No language to generate from');
      return;
    }

    setIsLoading(true);

    await generateTranslation(fromLanguage, language, translation, options);

    setIsLoading(false);

    successToast('Translation generated');
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
              onClick={(e) => {
                setSelectedTranslation({
                  language,
                  translation,
                });
              }}
              className={`
                group flex w-full justify-between pl-6 ${missingTranslations[language].includes(translation) ? 'text-red-500' : ''}
                ${!isEmpty(missing[translation]?.empty) || !isEmpty(missing[translation]?.missing) ? 'text-orange-400' : ''}
              `}
            >
              {translation}
              <Trash2Icon
                onClick={() => setOpen(Dialogs.DeleteTranslation, true)}
                className="h-4 w-4 text-transparent hover:text-gray-500 group-hover:text-gray-400"
              />
              <DeleteTranslationModal translation={translation} language={language} onDelete={onTranslationDelete} />
            </Button>
          ))}
        {missingTranslations[language]?.map((translation) => (
          <div key={language + translation} className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="group flex w-full justify-between pl-6 text-red-500 hover:bg-red-100 hover:text-red-700"
              onClick={() => setOpen(Dialogs.UploadTranslation, true)}
            >
              {translation}
              <span className="flex items-center text-transparent group-hover:text-red-600 transition-all duration-300">
                AI
                <UploadIcon className="h-4 w-4 ml-2" />
              </span>
            </Button>
            <input
              ref={fileInputRef}
              accept=".json"
              type="file"
              className="hidden"
              onChange={(e) => onTranslationChange(e, { language, translation })}
            />
            <UploadTranslationModal
              translation={translation}
              onUpload={onTranslationUpload}
              onGenerate={onGenerateTranslation}
            />
            <GenerateWithAIModal translation={translation} onGenerate={onGenerateTranslation} />
          </div>
        ))}
        <AddTranslationButton language={language} />
      </CollapsibleContent>
    </Collapsible>
  );
};

const AddTranslationButton = ({ language }: { language: string }) => {
  const { addTranslation } = useTranslationStore();

  const onAddTranslation = async () => {
    const translationName = 'translation-' + crypto.randomUUID().substring(0, 8)

    addTranslation(language, { [translationName]: '' });

    try {
      await createTranslation(language, translationName)

      successToast('Translation created successfully')
    } catch (error: any) {
      errorToast(error.message)
    }
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

const DeleteTranslationModal = ({ language, translation, onDelete }: { language: string, translation: string, onDelete: (language: string, translation: string) => void }) => {
  const { isOpen, setOpen } = useDialogStore((state) => ({
    isOpen: state.open[Dialogs.DeleteTranslation],
    setOpen: state.setOpen,
  }));

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setOpen(Dialogs.DeleteTranslation, open)} defaultOpen={isOpen} modal>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Delete Translation</DialogTitle>
          <DialogDescription className="text-base">Are you sure you want to continue deleting?</DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start mt-4">
          <DialogClose asChild>
            <Button onClick={() => onDelete(language, translation)} className="bg-blue-600 hover:bg-blue-500" type="submit">
              Delete
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

const UploadTranslationModal = ({
  onUpload,
}: {
  translation: string;
  onUpload: () => void;
  onGenerate: (translation: string) => void;
}) => {
  const { isOpen, setOpen } = useDialogStore((state) => ({
    isOpen: state.open[Dialogs.UploadTranslation],
    setOpen: state.setOpen,
  }));

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setOpen(Dialogs.UploadTranslation, open)} defaultOpen={isOpen} modal>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Create translation</DialogTitle>
          <DialogDescription className="text-base">
            You can choose to upload it by yourself or generate the translation with AI.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start mt-4">
          <DialogClose asChild>
            <Button onClick={onUpload} className="bg-blue-600 hover:bg-blue-500" type="submit">
              Upload
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={() => {
                setOpen(Dialogs.GenerateTranslation, true);
              }}
              type="button"
              variant="secondary"
            >
              Generate with AI
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const GenerateWithAIModal = ({
  translation,
  onGenerate,
}: {
  translation: string;
  onGenerate: (translation: string, options?: { context?: string; translateKeys?: boolean }) => void;
}) => {
  const { isOpen, setOpen } = useDialogStore((state) => ({
    isOpen: state.open[Dialogs.GenerateTranslation],
    setOpen: state.setOpen,
  }));

  const [translateKeys, setTranslateKeys] = useState<boolean>(false);
  const [translationContext, setTranslationContext] = useState<string>('');

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => setOpen(Dialogs.GenerateTranslation, open)}
      defaultOpen={isOpen}
      modal
    >
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl gap-2">
            AI generation options
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <InfoIcon className="w-5 h-5 text-gray-900" />
              </TooltipTrigger>
              <TooltipContent className="text-sm font-light sm:max-w-[350px]">
                <ul className="mb-4">
                  <li>
                    <span className="font-semibold">Context: </span>Provide a context for the translation so it can be
                    more accurate.
                  </li>
                  <li>
                    <span className="font-semibold">Translate keys: </span>Translate the keys to the target language.
                  </li>
                </ul>
                <span className="font-medium">
                  *AI translation is not always accurate and may require manual adjustments.
                </span>
              </TooltipContent>
            </Tooltip>
          </DialogTitle>
        </DialogHeader>
        <span className="flex flex-col justify-center gap-2">
          <span>Translation context:</span>
          <Input
            type="text"
            value={translationContext}
            onChange={(e) => setTranslationContext(e.target.value)}
            placeholder="Software development, games..."
            className="bg-transparent"
          />
        </span>
        <span className="flex items-center gap-2 mt-2">
          <Checkbox
            className="border-gray-600 hover:border-gray-700"
            id="translate-keys"
            onCheckedChange={() => setTranslateKeys(!translateKeys)}
            checked={translateKeys}
          />
          <Label
            htmlFor="translate-keys"
            className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70 peer-hover:text-gray-600"
          >
            Translate keys
          </Label>
        </span>
        <DialogFooter className="sm:justify-start mt-4">
          <DialogClose asChild>
            <Button
              onClick={() => onGenerate(translation, { context: translationContext, translateKeys })}
              type="button"
            >
              Generate
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LanguageCollapsible;
