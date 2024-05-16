import { Dashboard } from '@/components/dashboard';
import { FullPageLoader } from '@/components/full-page-loader';
import Navbar from '@/components/navbar';
import { TooltipProvider } from '@/components/ui/tooltip';
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
        <FullPageLoader />
        <TooltipProvider>
          <Dashboard />
        </TooltipProvider>
      </Suspense>
      <Toaster />
    </div>
  );
}
