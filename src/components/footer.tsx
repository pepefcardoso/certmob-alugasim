import Link from 'next/link';
import { BrandLockup } from '@/components/brand-lockup';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-neutral-300 px-6 py-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <BrandLockup />
        <div className="text-body-sm flex flex-wrap gap-4 text-neutral-700">
          <Link href="/privacy" className="hover:text-neutral-950">
            Política de Privacidade
          </Link>
          <Link href="/terms" className="hover:text-neutral-950">
            Termos de Uso
          </Link>
          <Link href="/privacy/request" className="hover:text-neutral-950">
            Meus dados (LGPD)
          </Link>
        </div>
      </div>
    </footer>
  );
}
