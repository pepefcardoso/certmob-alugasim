import { requireSession } from '@/lib/auth';

export default async function DashboardPage() {
  await requireSession();
  return <h1>Dashboard</h1>;
}
