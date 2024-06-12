import { downloadJsonFile, minifyJsonString, prettifyJsonString, parseJsonSchemaString } from '@/lib/json-editor';
import { BeforeMount, OnMount, OnValidate, useMonaco } from '@monaco-editor/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useToggle } from './useToggle';
import { useTranslationStore } from '../store/useTranslationStore';
import { useResizableStore } from '../store/useResizableStore';

interface RefObject {
  _domElement?: HTMLElement;
  getValue: () => string;
  setValue: (value: string) => void;
  getAction: (action: string) => { run: () => void };
}

interface JsonEditorProps {
  defaultValue?: string;
  schemaValue?: string;
  onChange?: (value?: string) => void;
}

export const useJsonEditor = ({ defaultValue, schemaValue, onChange }: JsonEditorProps) => {
  const monaco = useMonaco();
  const [errors, setErrors] = useState<string[]>([]);
  const [isValidJson, setIsValidJson] = useState(true);
  const [isAutoPrettifyOn, toggleAutoPrettifyOn] = useToggle(false);

  const { language, translation } = useTranslationStore((state) => state.selectedTranslation);
  const setOpen = useResizableStore((state) => state.setOpen);

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

  const handleOpenResizableClick = (targetLanguage: string, value: boolean) => {
    setOpen(language, targetLanguage, translation, value);
  };

  useEffect(() => {
    handleEditorUpdateValue(defaultValue);
  }, [defaultValue, handleEditorUpdateValue]);

  useEffect(() => {
    handleJsonSchemasUpdate();
  }, [schemaValue, handleJsonSchemasUpdate]);

  useEffect(() => {
    updateEditorLayout();
  }, [updateEditorLayout]);

  useEffect(() => {
    isAutoPrettifyOn && handleEditorPrettify();
  }, [isAutoPrettifyOn, handleEditorPrettify]);

  return {
    handleEditorWillMount,
    handleEditorDidMount,
    handleEditorValidation,
    handleMinifyClick,
    handleUploadClick,
    handleDownloadClick,
    handleEditorChange,
    handleEditorPrettify,
    handleOpenResizableClick,
    errors,
    isValidJson,
    isAutoPrettifyOn,
    toggleAutoPrettifyOn,
  };
};
