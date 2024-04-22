import React, { useCallback, useEffect, useRef, useState } from 'react';

import Editor, { useMonaco, BeforeMount, OnMount, OnValidate } from '@monaco-editor/react';
import dirtyJson from 'dirty-json';

import ErrorMessageBar from './error-message-bar';
import { ToolBar } from './tool-bar';
import { downloadJsonFile, minifyJsonString, prettifyJsonString, parseJsonSchemaString } from '../../lib/json-editor';
import { useToggle } from '@/app/hooks/useToggle';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { isEmpty } from '@/lib/helpers';
import { cn } from '@/lib/utils';

initializeIcons();

interface JSONEditorProps {
  value?: string;
  defaultValue?: string;
  schemaValue?: string;
  title?: string;
  path?: string;
  isSchemaSampleDataOn: boolean;
  onChange?: (value?: string) => void;
}

interface RefObject {
  _domElement?: HTMLElement;
  getValue: () => string;
  setValue: (value: string) => void;
  getAction: (action: string) => { run: () => void };
}

export const JSONEditor = ({
  value,
  defaultValue,
  schemaValue,
  path = '',
  isSchemaSampleDataOn,
  onChange,
}: JSONEditorProps) => {
  const monaco = useMonaco();
  const [errors, setErrors] = useState<string[]>([]);
  const [isAutoPrettifyOn, toggleAutoPrettifyOn] = useToggle(false);
  const [isValidJson, setIsValidJson] = useState(true);
  const editorRef = useRef<RefObject>();

  const updateEditorLayout = useCallback(() => {
    const editor: any = editorRef.current;
    if (!editor) return;
    editor.layout({
      width: 'auto',
      height: 'auto',
    });
    // eslint-disable-next-line
    const editorEl = editor._domElement;
    if (!editorEl) return;
    const { width, height } = editorEl.getBoundingClientRect();

    editor.layout({
      width,
      height,
    });
  }, []);

  const handleJsonSchemasUpdate = useCallback(() => {
    monaco?.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: schemaValue
        ? [
            {
              uri: window.location.href,
              fileMatch: ['*'],
              schema: {
                ...parseJsonSchemaString(schemaValue),
              },
            },
          ]
        : undefined,
    });
  }, [schemaValue, monaco]);

  const handleEditorPrettify = useCallback(() => {
    editorRef.current?.getAction('editor.action.formatDocument')?.run();
  }, []);

  const handleEditorUpdateValue = useCallback((value?: string) => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.setValue(value || '');
    value && editor?.getAction('editor.action.formatDocument')?.run();
  }, []);

  const handleEditorWillMount: BeforeMount = () => handleJsonSchemasUpdate();

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor as RefObject;

    editor.getModel()?.updateOptions({ tabSize: 2, insertSpaces: false });
    updateEditorLayout();

    window.addEventListener('resize', () => {
      updateEditorLayout();
    });

    defaultValue && handleEditorUpdateValue(prettifyJsonString(defaultValue));
  };

  useEffect(() => {
    handleEditorUpdateValue(defaultValue);
  }, [defaultValue, handleEditorUpdateValue]);

  useEffect(() => {
    handleJsonSchemasUpdate();
  }, [schemaValue, handleJsonSchemasUpdate]);

  useEffect(() => {
    updateEditorLayout();
  }, [isSchemaSampleDataOn, updateEditorLayout]);

  useEffect(() => {
    isAutoPrettifyOn && handleEditorPrettify();
  }, [isAutoPrettifyOn, handleEditorPrettify]);

  const handleEditorValidation: OnValidate = useCallback((markers) => {
    const errorMessage = markers.map(({ startLineNumber, message }) => `line ${startLineNumber}: ${message}`);
    const hasContent = editorRef.current?.getValue();
    const hasError: boolean = errorMessage.length > 0;
    setIsValidJson(!!hasContent && !hasError);
    setErrors(errorMessage);
  }, []);

  const handleMinifyClick = () => {
    const editor = editorRef.current;
    if (!editor) return;
    const value = editor.getValue();
    const minifiedValue = minifyJsonString(value);
    editor.setValue(minifiedValue);
  };

  const handleUploadClick = (file: File) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const result = fileReader.result as string;
      handleEditorUpdateValue(result);
    };
    fileReader.readAsText(file);
  };

  const handleDownloadClick = () => {
    const value = editorRef.current?.getValue();
    value && downloadJsonFile(value);
  };

  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      isAutoPrettifyOn && handleEditorPrettify();
      onChange && onChange(value);
    },
    [isAutoPrettifyOn, handleEditorPrettify, onChange],
  );

  return (
    <div className="h-full">
      <ToolBar
        isValidJson={isValidJson}
        isAutoPrettifyOn={isAutoPrettifyOn}
        onAutoPrettifyChange={toggleAutoPrettifyOn}
        onDownloadClick={handleDownloadClick}
        onMinifyClick={handleMinifyClick}
        onPrettifyClick={handleEditorPrettify}
        onUploadClick={handleUploadClick}
      />
      <div
        className={cn(
          {
            'h-[calc(100%-74px)]': isEmpty(errors),
            'h-5/6': !isEmpty(errors),
          },
          'border-none w-full',
        )}
      >
        <Editor
          value={value}
          width="100%"
          language="json"
          path={path}
          options={{
            lineNumbersMinChars: 3,
            folding: false,
            wordBreak: 'keepAll',
            wordWrap: 'on',
            fontSize: 14,
            lineHeight: 28,
            scrollbar: {
              verticalScrollbarSize: 0,
            },
            automaticLayout: true,
            occurrencesHighlight: 'off',
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            formatOnPaste: true,
            formatOnType: true,
            scrollBeyondLastLine: false,
            glyphMargin: false,
          }}
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
          beforeMount={handleEditorWillMount}
          onValidate={handleEditorValidation}
        />
      </div>
      <ErrorMessageBar className={cn('max-h-24 overflow-y-scroll')} errors={errors} />
    </div>
  );
};
