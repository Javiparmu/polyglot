import React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from './ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { InfoIcon, PlusIcon } from 'lucide-react';
import { useTranslationStore } from '@/app/store/useTranslationStore';
import { isEmpty } from '@/lib/helpers';

interface EditorInfoProps {
  onItemClick: (field: string) => void;
  language: string;
  translation: string;
}

const EditorInfo = ({ onItemClick, language, translation }: EditorInfoProps) => {
  const { missingFields } = useTranslationStore();

  return (
    <Breadcrumb className="flex items-center h-10 gap-8 mb-2 ml-5">
      <BreadcrumbList className="flex items-center">
        <BreadcrumbItem className="text-slate-500 hover:text-slate-700 cursor-default">{language}</BreadcrumbItem>
        <BreadcrumbSeparator className="text-slate-500" />
        <BreadcrumbItem className="text-slate-500 hover:text-slate-700 cursor-default">{translation}</BreadcrumbItem>
      </BreadcrumbList>
      {!isEmpty(missingFields?.[language]?.[translation]) && (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-1 rounded-full border-2 border-slate-200">
            <InfoIcon className="w-4 h-4 text-red-400 cursor-pointer" />
            Missing fields
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className="text-slate-600 cursor-pointer">Missing</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {missingFields[language][translation].map((field) => (
              <DropdownMenuItem
                key={field}
                onClick={() => onItemClick(field)}
                className="flex items-center justify-between gap-2 text-slate-500 hover:text-slate-700"
              >
                {field}
                <PlusIcon className="w-4 h-4" />
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </Breadcrumb>
  );
};

export default EditorInfo;
