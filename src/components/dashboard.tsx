import TranslationEditor from '@/components/translation-editor';
import Sidebar from './sidebar';
import { getTranslations } from '@/app/actions/getTranslations';

export async function Dashboard() {
  const translations = await getTranslations();

  return (
    <main className="flex flex-1 min-h-0 overflow-hidden">
      <Sidebar translationData={translations} />
      <section className="flex flex-1 min-h-0 h-[calc(100vh-60px)] overflow-y-auto py-4 px-4 bg-background-primary-light">
        <TranslationEditor />
      </section>
    </main>
  );
}
