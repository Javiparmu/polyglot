import React, { useEffect, useMemo, useState } from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from './ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useTranslationStore } from '@/app/store/useTranslationStore';
import { isEmpty } from '@/lib/helpers';
import { Edit3Icon, InfoIcon, PlusIcon } from 'lucide-react';
import { updateTranslationName } from '@/app/actions/updateTranslations';
import { successToast } from '@/lib/toasts';

interface EditorInfoProps {
  onItemClick: (field: string) => void;
  language: string;
  translation: string;
}

const EditorInfo = ({ onItemClick, language, translation }: EditorInfoProps) => {
  const { missingFields, changeTranslationName } = useTranslationStore();
  const { missing, empty } = useMemo(
    () => missingFields?.[language]?.[translation] || {},
    [language, translation, missingFields],
  );

  const [translationName, setTranslationName] = useState(translation);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setTranslationName(translation);
  }, [translation]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTranslationName(event.target.value);
  };

  const handleBlur = async () => {
    setIsEditing(false);

    await updateTranslationName(language, translation, translationName);

    changeTranslationName(language, translation, translationName);

    successToast('Translation name updated');
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  return (
    <Breadcrumb className="flex items-center h-10 gap-8 mb-2 ml-5">
      <BreadcrumbList className="flex items-center">
        <BreadcrumbItem className="text-slate-500 hover:text-slate-700 cursor-default">{language}</BreadcrumbItem>
        <BreadcrumbSeparator className="text-slate-500" />
        <BreadcrumbItem className="group text-slate-500 hover:text-slate-700 gap-2">
          <div className="flex items-center gap-2">
            {isEditing ? (
              <input
                type="text"
                value={translationName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className="border-none outline-none bg-transparent"
                autoFocus
              />
            ) : (
              <span className="flex items-center gap-2" onClick={handleEditClick}>
                {translationName}
                <Edit3Icon className="w-4 h-4 text-slate-500 hidden group-hover:block" />
              </span>
            )}
          </div>
        </BreadcrumbItem>
      </BreadcrumbList>
      {(!isEmpty(missing) || !isEmpty(empty)) && (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-1 rounded-full border-2 border-slate-200">
            <InfoIcon className="w-4 h-4 text-red-400 cursor-pointer" />
            Missing fields
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className="text-slate-600">Missing</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {missing.map((field) => (
              <DropdownMenuItem
                key={field}
                onClick={() => onItemClick(field)}
                className="flex items-center justify-between gap-2 text-slate-500 hover:text-slate-700"
              >
                {field}
                <PlusIcon className="w-4 h-4" />
              </DropdownMenuItem>
            ))}
            <DropdownMenuLabel className="text-slate-600">Empty</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {empty.map((field) => (
              <DropdownMenuItem
                key={field}
                className="flex items-center justify-between gap-2 text-slate-500 hover:text-slate-700"
              >
                {field}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </Breadcrumb>
  );
};

export default EditorInfo;
