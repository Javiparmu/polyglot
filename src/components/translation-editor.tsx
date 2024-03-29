'use client';

import { useEffect, useRef, useMemo } from 'react';
import { useTranslationStore } from '@/app/store/useTranslationStore';
import EditorInfo from './editor-info';
import { JSONEditor } from './json-editor/json-editor';

const TranslationEditor = () => {
  const {
    translations,
    updateTranslations,
    addFieldToTranslation,
    selectedTranslation: { language, translation },
  } = useTranslationStore();

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const jsonPrettyRef = useRef<HTMLPreElement>(null);

  const translationData = useMemo(() => translations?.[language]?.[translation], [language, translation, translations]);

  useEffect(() => {
    if (textAreaRef.current && jsonPrettyRef.current) {
      textAreaRef.current.style.height = `${jsonPrettyRef.current.offsetHeight}px`;
    }
  }, [language, translation]);

  const handleChange = (value: any) => {
    updateTranslations({
      ...translations,
      [language]: {
        ...translations[language],
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
          <JSONEditor
            value={translationData}
            title={`${language} - ${translation}`}
            onChange={handleChange}
            isSchemaSampleDataOn={false}
          />
        )}
      </div>
    </div>
  );
};

export default TranslationEditor;
