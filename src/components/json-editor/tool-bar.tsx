import React, { useRef } from 'react';

import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import CommandBar, { CommandBarItem } from './command-bar';
import CommandButton from './command-button';
import { CodeIcon, DownloadIcon, Minimize2Icon, UploadIcon } from 'lucide-react';

export interface ToolBarProps {
  onMinifyClick: () => void;
  onPrettifyClick: () => void;
  onAutoPrettifyChange: () => void;
  onDownloadClick: () => void;
  onUploadClick: (fileContent: File) => void;
  isAutoPrettifyOn: boolean;
  isValidJson: boolean;
}

interface FileUploaderProps {
  onFileHandle: (fileContent: File) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileHandle }) => {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    if (inputFileRef.current) {
      inputFileRef.current.value = '';
      inputFileRef.current.click();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const fileUploaded = e.target.files[0];
    onFileHandle(fileUploaded);
  };

  const uploadIcon = <UploadIcon className="h-4 w-4" />;

  return (
    <>
      <CommandButton onClick={handleUploadClick}>
        {uploadIcon}
        Upload
      </CommandButton>
      <input
        ref={inputFileRef}
        style={{ display: 'none' }}
        onChange={handleChange}
        type="file"
        accept="application/json"
      />
    </>
  );
};

export const ToolBar: React.FC<ToolBarProps> = ({
  onMinifyClick,
  onPrettifyClick,
  isAutoPrettifyOn,
  onAutoPrettifyChange,
  onDownloadClick,
  onUploadClick,
  isValidJson,
}) => {
  const items: CommandBarItem[] = [
    {
      key: 'upload',
      onRender: () => <FileUploader onFileHandle={onUploadClick} />,
    },
    {
      key: 'download',
      text: 'Download',
      icon: <DownloadIcon className="h-4 w-4" />,
      onClick: onDownloadClick,
      disabled: !isValidJson,
    },
    {
      key: 'minify',
      text: 'Minify',
      icon: <Minimize2Icon className="h-4 w-4" />,
      onClick: onMinifyClick,
      disabled: !isValidJson || isAutoPrettifyOn,
    },
    {
      key: 'prettify',
      text: 'Prettify',
      icon: <CodeIcon className="h-4 w-4" />,
      onClick: onPrettifyClick,
      disabled: !isValidJson || isAutoPrettifyOn,
    },
    {
      key: 'auto-prettify',
      onRender: () => (
        <CommandButton onClick={onAutoPrettifyChange}>
          <Checkbox
            className="border-gray-600 hover:border-gray-700"
            id="auto-prettify"
            onCheckedChange={onAutoPrettifyChange}
            checked={isAutoPrettifyOn}
          />
          <Label
            htmlFor="auto-prettify"
            className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70 peer-hover:text-gray-600"
          >
            Auto Prettify
          </Label>
        </CommandButton>
      ),
    },
  ];

  return <CommandBar className="ml-8" items={items} />;
};
