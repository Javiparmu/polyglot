'use client';

import { useEffect, useState } from 'react';
import LanguageCollapsible from './language-collapsible';
import { useTranslationStore } from '@/app/store/useTranslationStore';
import { Translation } from '@/lib/types';

type CollapsibleState = {
  [key: string]: boolean;
};

interface SidebarProps {
  translationData: Translation;
}

const Sidebar = ({ translationData }: SidebarProps) => {
  const { languages, updateTranslations } = useTranslationStore();
  const [isOpen, setIsOpen] = useState<CollapsibleState>({});

  useEffect(() => {
    updateTranslations(translationData);
  }, [translationData, updateTranslations]);

  return (
    <aside className="hidden lg:flex w-[300px] h-[calc(100vh-60px)] max-h-[calc(100vh-60px)] border-r overflow-x-hidden small-scrollbar">
      <nav className="flex flex-col w-full border-gray-200 dark:border-gray-800">
        <div className="flex-1 py-4">
          <ul className="grid gap-1 text-sm">
            {languages.sort().map((lang) => (
              <li key={lang} className="px-4">
                <LanguageCollapsible
                  language={lang}
                  isOpen={isOpen[lang] ?? false}
                  onToggle={(open: boolean) => setIsOpen({ [lang]: open })}
                />
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
