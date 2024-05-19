import Editor from '@monaco-editor/react';

import ErrorMessageBar from './error-message-bar';
import { ToolBar } from './tool-bar';
import { isEmpty } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { useJsonEditor } from '@/app/hooks/useJsonEditor';
import { useTheme } from 'next-themes';

interface JSONEditorProps {
  value?: string;
  defaultValue?: string;
  schemaValue?: string;
  title?: string;
  path?: string;
  onChange?: (value?: string) => void;
}

export const JSONEditor = ({ value, defaultValue, schemaValue, path = '', onChange }: JSONEditorProps) => {
  const { theme } = useTheme();

  const {
    handleEditorDidMount,
    handleEditorWillMount,
    handleEditorChange,
    handleEditorValidation,
    handleDownloadClick,
    handleMinifyClick,
    handleUploadClick,
    handleEditorPrettify,
    isValidJson,
    isAutoPrettifyOn,
    toggleAutoPrettifyOn,
    errors,
  } = useJsonEditor({ defaultValue, schemaValue, onChange });

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
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
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
