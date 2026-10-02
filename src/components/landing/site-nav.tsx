import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LEAD_CTA_LABEL } from '@/components/landing/constants';

export function SiteNav() {
  return (
    <header className="border-border/60 bg-background/95 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <span className="font-heading text-base font-semibold tracking-tight">Alugasim</span>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link href="/sign-in">Entrar</Link>
          </Button>
          <Button asChild>
            <a href="#lead-magnet">
              <span className="sm:hidden">Calcular grátis</span>
              <span className="hidden sm:inline">{LEAD_CTA_LABEL}</span>
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
