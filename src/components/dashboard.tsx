import TranslationEditor from '@/components/translation-editor';
import Sidebar from './sidebar';

export async function Dashboard() {
  const response = await fetch('http://localhost:3000/api/translations', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-cache',
  });

  const { translations } = await response.json();

  return (
    <main className="flex flex-1 min-h-0 overflow-hidden">
      <Sidebar translationData={translations} />
      <section className="flex flex-1 min-h-0 h-[calc(100vh-60px)] overflow-y-auto py-4 px-4">
        <TranslationEditor />
      </section>
    </main>
  );
}
