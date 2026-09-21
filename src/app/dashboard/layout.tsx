import { requireSession } from '@/lib/auth';
import { AppSidebar } from '@/components/domain/app-sidebar';
import { AppBottomNav } from '@/components/domain/app-bottom-nav';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireSession();

  return (
    <div className="flex min-h-full flex-1">
      <AppSidebar />
      <main className="flex-1 p-4 pb-24 lg:p-8 lg:pb-8">{children}</main>
      <AppBottomNav />
    </div>
  );
}
