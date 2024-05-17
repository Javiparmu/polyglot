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
    <aside className="hidden w-[300px] border-r lg:flex">
      <nav className="flex flex-col w-[300px] border-gray-200 dark:border-gray-800">
        <div className="flex-1 overflow-auto py-4">
          <ul className="grid gap-1 text-sm">
            {languages.sort().map((lang) => (
              <li key={lang} className="px-4">
                <LanguageCollapsible
                  language={lang}
                  isOpen={isOpen[lang] ?? false}
                  onToggle={(open: boolean) => setIsOpen((prev) => ({ ...prev, [lang]: open }))}
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
