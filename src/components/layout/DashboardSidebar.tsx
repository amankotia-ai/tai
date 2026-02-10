import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  House,
  Storefront,
  Vault,
  FileText,
  Gear,
  CreditCard,
  SignOut,
  MagnifyingGlass,
  ChatCircle
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { storage } from '@/lib/store';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Home', href: '/dashboard', icon: House },
  { label: 'Search', href: '/dashboard/search', icon: MagnifyingGlass },
  { label: 'Messages', href: '/chat', icon: ChatCircle },
  { label: 'Projects', href: '/dashboard/marketplace', icon: Storefront },
  { label: 'Vault', href: '/vault', icon: Vault },
  { label: 'Contracts', href: '/contracts', icon: FileText },
  { label: 'Payments', href: '/payments', icon: CreditCard },
  { label: 'Settings', href: '/settings', icon: Gear },
];

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = storage.getUser();

  const handleSignOut = () => {
    storage.clearAll();
    navigate('/');
  };

  // Split nav items to add separator before Settings
  const mainNavItems = navItems.slice(0, -1);
  const settingsItem = navItems[navItems.length - 1];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-background border-r border-border/40 transition-all duration-300",
        collapsed ? "w-16" : "w-56"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center h-12 px-4 border-b border-border/40",
        collapsed ? "justify-center" : "gap-2"
      )}>
        {!collapsed && (
          <span className="text-[13px] font-semibold tracking-tight text-foreground">
            theatre.ai
          </span>
        )}
        {collapsed && (
          <span className="text-sm font-semibold text-foreground">t.</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2">
        <div className="space-y-0.5">
          {mainNavItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.label}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-[13px]",
                  isActive
                    ? "bg-muted text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  collapsed && "justify-center px-2"
                )}
              >
                <item.icon className="w-[18px] h-[18px] flex-shrink-0" weight={isActive ? "fill" : "regular"} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>

        {/* Separator before Settings */}
        <div className="my-3 mx-3 border-t border-border/40" />

        <Link
          to={settingsItem.href}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-[13px]",
            location.pathname === settingsItem.href
              ? "bg-muted text-foreground font-medium"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
            collapsed && "justify-center px-2"
          )}
        >
          <settingsItem.icon className="w-[18px] h-[18px] flex-shrink-0" weight={location.pathname === settingsItem.href ? "fill" : "regular"} />
          {!collapsed && <span>{settingsItem.label}</span>}
        </Link>
      </nav>

      {/* User Section */}
      <div className={cn(
        "border-t border-border/40 p-3",
        collapsed && "px-2"
      )}>
        {!collapsed && user && (
          <div className="mb-2 px-2">
            <p className="text-[13px] font-medium text-foreground truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "w-full text-muted-foreground hover:text-foreground hover:bg-muted/50 text-[13px]",
            collapsed ? "px-2" : "justify-start gap-2"
          )}
          onClick={handleSignOut}
        >
          <SignOut className="w-[18px] h-[18px]" />
          {!collapsed && "Sign Out"}
        </Button>
      </div>
    </aside>
  );
}
