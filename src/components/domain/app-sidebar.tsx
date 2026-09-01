'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PRIMARY_NAV, COLLECTIONS_NAV, MORE_NAV, type NavItem } from '@/lib/nav-items';
import { SignOutButton } from '@/components/domain/sign-out-button';
import { cn } from '@/lib/utils';

function isActive(pathname: string, href: string) {
  return href === '/dashboard' ? pathname === href : pathname.startsWith(href);
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-surface hidden w-60 shrink-0 flex-col border-r border-neutral-300 px-4 py-6 lg:flex">
      <Link href="/dashboard" className="text-heading-3 text-brand-900 mb-8 px-2">
        Alugasim
      </Link>

      <nav className="flex flex-col gap-1">
        {[...PRIMARY_NAV, COLLECTIONS_NAV].map((item) => (
          <NavLink key={item.href} item={item} active={isActive(pathname, item.href)} />
        ))}
      </nav>

      <div className="mt-6 flex flex-col gap-1 border-t border-neutral-300 pt-6">
        {MORE_NAV.map((item) => (
          <NavLink key={item.href} item={item} active={isActive(pathname, item.href)} />
        ))}
      </div>

      <div className="mt-auto pt-6">
        <SignOutButton className="w-full justify-start" />
      </div>
    </aside>
  );
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;

  if (item.disabled) {
    return (
      <span className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-neutral-500">
        <Icon className="size-4.5" aria-hidden="true" />
        {item.label}
        {item.badge && <span className="text-caption ml-auto">{item.badge}</span>}
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        active
          ? 'bg-brand-100 text-brand-900'
          : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950',
      )}
    >
      <Icon className="size-4.5" aria-hidden="true" />
      {item.label}
    </Link>
  );
}
