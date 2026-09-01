'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MoreHorizontal } from 'lucide-react';
import { PRIMARY_NAV, COLLECTIONS_NAV, MORE_NAV, type NavItem } from '@/lib/nav-items';
import { SignOutButton } from '@/components/domain/sign-out-button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

function isActive(pathname: string, href: string) {
  return href === '/dashboard' ? pathname === href : pathname.startsWith(href);
}

export function AppBottomNav() {
  const pathname = usePathname();
  const moreActive = [COLLECTIONS_NAV, ...MORE_NAV].some((item) => isActive(pathname, item.href));

  return (
    <nav className="bg-surface fixed inset-x-0 bottom-0 z-40 flex border-t border-neutral-300 pb-[env(safe-area-inset-bottom)] lg:hidden">
      {PRIMARY_NAV.map((item) => (
        <Tab key={item.href} item={item} active={isActive(pathname, item.href)} />
      ))}

      <Popover>
        <PopoverTrigger asChild>
          <button
            className={cn(
              'text-caption flex flex-1 flex-col items-center gap-1 py-2',
              moreActive ? 'text-brand-900' : 'text-neutral-500',
            )}
          >
            <MoreHorizontal className="size-5" aria-hidden="true" />
            Mais
          </button>
        </PopoverTrigger>
        <PopoverContent side="top" align="end" className="w-56 p-2">
          <div className="flex flex-col gap-1">
            <MoreLink item={COLLECTIONS_NAV} />
            {MORE_NAV.map((item) => (
              <MoreLink key={item.href} item={item} />
            ))}
            <SignOutButton className="mt-1 w-full justify-start" />
          </div>
        </PopoverContent>
      </Popover>
    </nav>
  );
}

function Tab({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        'text-caption flex flex-1 flex-col items-center gap-1 py-2',
        active ? 'text-brand-900' : 'text-neutral-500',
      )}
    >
      <Icon className="size-5" aria-hidden="true" />
      {item.label}
    </Link>
  );
}

function MoreLink({ item }: { item: NavItem }) {
  const Icon = item.icon;

  if (item.disabled) {
    return (
      <span className="flex items-center gap-3 rounded-md px-2 py-2 text-sm text-neutral-500">
        <Icon className="size-4" aria-hidden="true" />
        {item.label}
        {item.badge && <span className="text-caption ml-auto">{item.badge}</span>}
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      className="flex items-center gap-3 rounded-md px-2 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
    >
      <Icon className="size-4" aria-hidden="true" />
      {item.label}
    </Link>
  );
}
