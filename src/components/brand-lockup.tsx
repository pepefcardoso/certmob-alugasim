import { cn } from '@/lib/utils';

export function BrandLockup({ className }: { className?: string }) {
  return (
    <div className={cn('leading-tight', className)}>
      <p className="text-heading-3 text-brand-900">Alugasim</p>
      <p className="text-caption text-neutral-500">por CertMob</p>
    </div>
  );
}
