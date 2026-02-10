import { Link, useLocation } from 'react-router-dom';
import {
  Vault,
  FileText,
  Gear,
  MagnifyingGlass,
  ChatCircle,
  Bell,
  NewspaperClipping,
  UsersThree,
  CreditCard,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { storage } from '@/lib/store';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Feed', href: '/dashboard/feed', activePaths: ['/dashboard/feed', '/feed'], icon: NewspaperClipping },
  { label: 'Search', href: '/dashboard/search', activePaths: ['/dashboard/search', '/dashboard/discover', '/search', '/dashboard/casting-calls', '/casting-calls'], icon: MagnifyingGlass },
  { label: 'Messages', href: '/dashboard/chat', activePaths: ['/dashboard/chat', '/dashboard/messages', '/chat'], icon: ChatCircle },
  { label: 'Vault', href: '/dashboard/vault', activePaths: ['/dashboard/vault', '/vault'], icon: Vault },
  { label: 'Contracts', href: '/dashboard/contracts', activePaths: ['/dashboard/contracts', '/contracts'], icon: FileText },
  { label: 'Payments', href: '/dashboard/payments', activePaths: ['/dashboard/payments', '/payments'], icon: CreditCard },
  { label: 'Network', href: '/dashboard/network', activePaths: ['/dashboard/network', '/network'], icon: UsersThree },
];

interface DashboardTopNavProps {
  fullWidth?: boolean;
  transparent?: boolean;
  contentClassName?: string;
  hiddenOnMobile?: boolean;
}

export function DashboardTopNav({
  fullWidth = false,
  transparent = false,
  contentClassName,
  hiddenOnMobile = false,
}: DashboardTopNavProps) {
  const location = useLocation();
  const user = storage.getUser();
  const pendingRequests = storage.getLicenseRequests().filter((request) => request.status === 'pending').length;

  const isActivePath = (paths: string[]) =>
    paths.some((path) => location.pathname === path || location.pathname.startsWith(`${path}/`));
  const settingsActive = isActivePath(['/dashboard/settings', '/settings']);

  return (
    <header
      className={cn(
        'fixed left-0 right-0 top-0 z-40 h-14',
        transparent ? 'border-none bg-transparent' : 'border-b border-border/40 bg-white',
        hiddenOnMobile && 'hidden lg:block',
      )}
    >
      <div
        className={cn(
          'flex h-full items-center justify-between px-6',
          fullWidth ? 'w-full' : 'mx-auto max-w-7xl',
          contentClassName,
        )}
      >
        <Link to="/dashboard" className="flex items-center gap-2">
          <img src="/wpf_clapperboard.svg" alt="Logo" className="h-4 w-4" />
          <span className="text-[15px] font-semibold tracking-tight text-foreground">theatre.ai</span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = isActivePath(item.activePaths);

            return (
              <Link
                key={item.label}
                to={item.href}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-1.5 text-[13px] transition-colors',
                  isActive
                    ? 'bg-[#D61D1F]/10 font-medium text-[#D61D1F]'
                    : 'text-muted-foreground hover:bg-[#D61D1F]/5 hover:text-[#D61D1F]',
                )}
              >
                <item.icon className="h-[18px] w-[18px] flex-shrink-0" weight={isActive ? 'fill' : 'regular'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/dashboard/settings"
            aria-label="Open settings"
            className={cn(
              'flex items-center gap-2 rounded-lg px-3 py-1.5 text-[13px] transition-colors',
              settingsActive
                ? 'bg-[#D61D1F]/10 font-medium text-[#D61D1F]'
                : 'text-muted-foreground hover:bg-[#D61D1F]/5 hover:text-[#D61D1F]',
            )}
          >
            <Gear className="h-[18px] w-[18px]" weight={settingsActive ? 'fill' : 'regular'} />
          </Link>

          <Button
            variant="ghost"
            size="icon"
            aria-label="View notifications"
            className="relative h-8 w-8 hover:bg-[#D61D1F]/10 hover:text-[#D61D1F]"
          >
            <Bell className="h-[18px] w-[18px]" weight="regular" />
            {pendingRequests > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#D61D1F] text-[10px] font-medium text-white">
                {pendingRequests}
              </span>
            )}
          </Button>

          <div className="ml-2">
            <Link
              to="/dashboard/profile"
              aria-label="Open profile"
              className={cn(
                'block h-8 w-8 overflow-hidden rounded-full ring-2 transition-all',
                location.pathname === '/dashboard/profile'
                  ? 'ring-[#D61D1F]'
                  : 'ring-transparent hover:ring-[#D61D1F]/20',
              )}
            >
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop"
                alt={user?.name || 'Profile'}
                className="h-full w-full object-cover"
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
