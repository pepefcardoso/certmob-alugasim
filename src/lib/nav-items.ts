import type { LucideIcon } from 'lucide-react';
import { Home, Building2, Wallet, Send, FileText, BarChart3, User } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
  badge?: string;
}

export const PRIMARY_NAV: NavItem[] = [
  { label: 'Início', href: '/dashboard', icon: Home },
  { label: 'Imóveis', href: '/dashboard/properties', icon: Building2 },
  { label: 'Recebimentos', href: '/dashboard/payments', icon: Wallet },
];

export const COLLECTIONS_NAV: NavItem = {
  label: 'Cobranças',
  href: '/dashboard/collections',
  icon: Send,
  disabled: true,
  badge: 'Em breve',
};

export const MORE_NAV: NavItem[] = [
  { label: 'Contratos', href: '/dashboard/contracts', icon: FileText },
  { label: 'Relatórios', href: '/dashboard/reports', icon: BarChart3 },
  { label: 'Perfil', href: '/dashboard/profile', icon: User },
];
