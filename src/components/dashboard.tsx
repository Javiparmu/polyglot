import TranslationEditor from '@/components/translation-editor';
import Sidebar from './sidebar';
import { getTranslations } from '@/app/actions/getTranslations';
import { TooltipProvider } from './ui/tooltip';

export async function Dashboard() {
  const translations = await getTranslations();

  return (
    <main className="flex flex-1 min-h-0 overflow-hidden">
      <TooltipProvider>
        <Sidebar translationData={translations} />
        <section className="flex flex-1 min-h-0 h-[calc(100vh-60px)] overflow-y-auto py-4 px-4 bg-background-primary-light">
          {Object.keys(translations).length === 0 ? (
            <div className="flex items-center justify-center h-full w-full">
              <p className="text-xl text-center text-primary-light max-w-[600px]">
                No translations found, you need to set up your config in the settings or upload translations to your
                bucket.
              </p>
            </div>
          ) : (
            <TranslationEditor />
          )}
        </section>
      </TooltipProvider>
    </main>
  );
}
