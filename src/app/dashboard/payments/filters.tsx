'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface FilterOption {
  value: string;
  label: string;
}

export function PaymentFilters({
  properties,
  tenants,
}: {
  properties: FilterOption[];
  tenants: FilterOption[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <select
        className="bg-surface rounded-md border border-neutral-300 px-3 py-2 text-sm"
        value={searchParams.get('status') ?? ''}
        onChange={(e) => updateParam('status', e.target.value)}
      >
        <option value="">Todos os status</option>
        <option value="UPCOMING">Pendente</option>
        <option value="LATE">Em atraso</option>
        <option value="PAID">Recebido</option>
      </select>

      <select
        className="bg-surface rounded-md border border-neutral-300 px-3 py-2 text-sm"
        value={searchParams.get('propertyId') ?? ''}
        onChange={(e) => updateParam('propertyId', e.target.value)}
      >
        <option value="">Todos os imóveis</option>
        {properties.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
      </select>

      <select
        className="bg-surface rounded-md border border-neutral-300 px-3 py-2 text-sm"
        value={searchParams.get('tenantId') ?? ''}
        onChange={(e) => updateParam('tenantId', e.target.value)}
      >
        <option value="">Todos os inquilinos</option>
        {tenants.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>
    </div>
  );
}
