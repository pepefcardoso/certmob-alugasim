import Link from 'next/link';
import { requireSession } from '@/lib/auth';

export default async function DashboardLayout({ children }: LayoutProps<'/dashboard'>) {
  await requireSession();

  return (
    <div className="flex min-h-full flex-col">
      <nav className="flex items-center gap-4 border-b px-6 py-3">
        <Link href="/dashboard" className="font-semibold">
          RentEasy
        </Link>
        <Link href="/dashboard/properties">Imóveis</Link>
        <Link href="/dashboard/tenants">Locatários</Link>
        <Link href="/dashboard/contracts">Contratos</Link>
        <Link href="/dashboard/reports">Relatórios</Link>
        <Link href="/dashboard/profile">Perfil</Link>
      </nav>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
