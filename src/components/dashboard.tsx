import TranslationEditor from '@/components/translation-editor';
import Sidebar from './sidebar';
import { getTranslations } from '@/app/actions/getTranslations';
import { TooltipProvider } from './ui/tooltip';

export async function Dashboard() {
  // const translations = await getTranslations();

  return (
    <main className="flex flex-1 min-h-0 overflow-hidden">
      <TooltipProvider>
        <Sidebar translationData={{}} />
        <section className="flex flex-1 min-h-0 h-[calc(100vh-60px)] overflow-y-auto py-4 px-4 bg-background-primary-light">
          <TranslationEditor />
        </section>
      </TooltipProvider>
    </main>
  );
}
