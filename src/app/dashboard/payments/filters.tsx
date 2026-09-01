'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
    if (value && value !== 'all') params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="grid gap-3 sm:grid-cols-4">
      <div className="space-y-1.5">
        <Label htmlFor="filter-period">Período</Label>
        <Select
          value={searchParams.get('period') ?? '6'}
          onValueChange={(v) => updateParam('period', v)}
        >
          <SelectTrigger id="filter-period" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">Últimos 3 meses</SelectItem>
            <SelectItem value="6">Últimos 6 meses</SelectItem>
            <SelectItem value="12">Último ano</SelectItem>
            <SelectItem value="all">Todos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="filter-status">Status</Label>
        <Select
          value={searchParams.get('status') ?? 'all'}
          onValueChange={(v) => updateParam('status', v)}
        >
          <SelectTrigger id="filter-status" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="UPCOMING">Pendente</SelectItem>
            <SelectItem value="LATE">Em atraso</SelectItem>
            <SelectItem value="PAID">Recebido</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="filter-property">Imóvel</Label>
        <Select
          value={searchParams.get('propertyId') ?? 'all'}
          onValueChange={(v) => updateParam('propertyId', v)}
        >
          <SelectTrigger id="filter-property" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os imóveis</SelectItem>
            {properties.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="filter-tenant">Inquilino</Label>
        <Select
          value={searchParams.get('tenantId') ?? 'all'}
          onValueChange={(v) => updateParam('tenantId', v)}
        >
          <SelectTrigger id="filter-tenant" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os inquilinos</SelectItem>
            {tenants.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}