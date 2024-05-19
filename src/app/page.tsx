import { Dashboard } from '@/components/dashboard';
import { FullPageLoader } from '@/components/full-page-loader';
import Navbar from '@/components/navbar';
import { Toaster } from 'sonner';

export default async function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <FullPageLoader />
      <Dashboard />
      <Toaster />
    </div>
  );
}
