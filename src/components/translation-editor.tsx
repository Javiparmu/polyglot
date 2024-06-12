'use client';

import { useEffect, useRef, useMemo } from 'react';
import { useTranslationStore } from '@/app/store/useTranslationStore';
import EditorInfo from './editor-info';
import { JSONEditor } from './json-editor/json-editor';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './ui/resizable';
import { useResizableStore } from '@/app/store/useResizableStore';

const TranslationEditor = () => {
  const translations = useTranslationStore((state) => state.translations);
  const { language, translation } = useTranslationStore((state) => state.selectedTranslation);
  const updateTranslations = useTranslationStore((state) => state.updateTranslations);
  const addFieldToTranslation = useTranslationStore((state) => state.addFieldToTranslation);
  const setUpdatedTranslations = useTranslationStore((state) => state.setUpdatedTranslations);
  const updatedTranslations = useTranslationStore((state) => state.updatedTranslations);

  const open = useResizableStore((state) => state.open);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const jsonPrettyRef = useRef<HTMLPreElement>(null);

  const translationData = useMemo(() => translations?.[language]?.[translation], [language, translation, translations]);
  const resizableLanguage = useMemo(() => open?.[language]?.[translation], [language, translation, open]);

  useEffect(() => {
    if (textAreaRef.current && jsonPrettyRef.current) {
      textAreaRef.current.style.height = `${jsonPrettyRef.current.offsetHeight}px`;
    }
  }, [language, translation]);

  const handleChange = (value: any) => {
    if (!updatedTranslations.some((t) => t.language === language && t.translation === translation)) {
      setUpdatedTranslations([...updatedTranslations, { language, translation }]);
    }
    updateTranslations({
      ...translations,
      [language]: {
        ...translations[language],
        [translation]: value,
      },
    });
  };

  const handleResizableChange = (value?: string) => {
    if (!value) return;

    if (!updatedTranslations.some((t) => t.language === resizableLanguage && t.translation === translation)) {
      setUpdatedTranslations([...updatedTranslations, { language: resizableLanguage, translation }]);
    }
    updateTranslations({
      ...translations,
      [resizableLanguage]: {
        ...translations[resizableLanguage],
        [translation]: value,
      },
    });
  };

  const onFieldClick = (field: string) => {
    addFieldToTranslation(language, translation, field);
  };

  return (
    <div className="w-full h-full">
      {language && <EditorInfo onItemClick={onFieldClick} language={language} translation={translation} />}
      <div className="max-w-[1400px] h-[calc(100%-32px)]">
        {translationData != null && (
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel>
              <JSONEditor value={translationData} title={`${language} - ${translation}`} onChange={handleChange} />
            </ResizablePanel>
            {!!resizableLanguage && (
              <>
                <ResizableHandle />
                <ResizablePanel>
                  <JSONEditor
                    value={translations?.[resizableLanguage]?.[translation]}
                    title={`${language} - ${translation}`}
                    onChange={handleResizableChange}
                    isSecondary
                  />
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  );
};

export default TranslationEditor;
