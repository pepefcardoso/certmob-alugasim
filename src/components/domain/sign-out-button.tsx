'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';

export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSignOut() {
    startTransition(async () => {
      await authClient.signOut();
      router.push('/sign-in');
      router.refresh();
    });
  }

  return (
    <Button variant="ghost" className={className} onClick={handleSignOut} disabled={isPending}>
      <LogOut className="size-4" aria-hidden="true" />
      {isPending ? 'Saindo...' : 'Sair'}
    </Button>
  );
}
