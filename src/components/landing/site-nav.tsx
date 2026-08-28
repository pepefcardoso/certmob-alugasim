import { Button } from '@/components/ui/button';
import { LEAD_CTA_LABEL } from '@/components/landing/constants';

export function SiteNav() {
  return (
    <header className="border-border/60 bg-background/95 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <span className="font-heading text-base font-semibold tracking-tight">RentEasy</span>
        <Button asChild size="sm">
          <a href="#lead-magnet">{LEAD_CTA_LABEL}</a>
        </Button>
      </div>
    </header>
  );
}
