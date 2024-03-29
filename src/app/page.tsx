import { Dashboard } from '@/components/dashboard';
import Navbar from '@/components/navbar';
import { Suspense } from 'react';
import { Toaster } from 'sonner';

export default async function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <Suspense
        fallback={
          <main className="flex flex-1 min-h-0">
            <aside className="hidden w-[300px] border-r lg:flex"></aside>
          </main>
        }
      >
        <Dashboard />
      </Suspense>
      <Toaster />
    </div>
  );
}
