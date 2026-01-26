import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  House, 
  Storefront, 
  Vault, 
  FileText, 
  Gear, 
  SignOut,
  ShieldCheck,
  CaretLeft,
  CaretRight,
  Bell
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { storage } from '@/lib/store';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: House },
  { label: 'Marketplace', href: '/dashboard/marketplace', icon: Storefront },
  { label: 'Biometrics Vault', href: '/dashboard/vault', icon: Vault },
  { label: 'Contracts', href: '/dashboard/contracts', icon: FileText },
  { label: 'Settings', href: '/dashboard/settings', icon: Gear },
];

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = storage.getUser();
  const pendingRequests = storage.getLicenseRequests().filter(r => r.status === 'pending').length;

  const handleSignOut = () => {
    storage.clearAll();
    navigate('/');
  };

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center h-16 px-4 border-b border-sidebar-border",
        collapsed ? "justify-center" : "gap-2"
      )}>
        <ShieldCheck className="w-8 h-8 text-sidebar-primary flex-shrink-0" weight="duotone" />
        {!collapsed && (
          <span className="text-lg font-bold tracking-tight text-sidebar-foreground">
            theatre<span className="text-sidebar-primary">.ai</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative",
                isActive 
                  ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent",
                collapsed && "justify-center px-2"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" weight={isActive ? "fill" : "regular"} />
              {!collapsed && <span className="font-medium">{item.label}</span>}
              {item.label === 'Biometrics Vault' && pendingRequests > 0 && (
                <Badge 
                  className={cn(
                    "bg-accent text-accent-foreground text-xs",
                    collapsed ? "absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center" : "ml-auto"
                  )}
                >
                  {pendingRequests}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className={cn(
        "border-t border-sidebar-border p-4",
        collapsed && "px-2"
      )}>
        {!collapsed && user && (
          <div className="mb-3 px-2">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
          </div>
        )}
        <Button 
          variant="ghost" 
          className={cn(
            "w-full text-sidebar-foreground hover:bg-sidebar-accent",
            collapsed ? "px-2" : "justify-start gap-2"
          )}
          onClick={handleSignOut}
        >
          <SignOut className="w-5 h-5" />
          {!collapsed && "Sign Out"}
        </Button>
      </div>

      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-sidebar border border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <CaretRight className="w-4 h-4" /> : <CaretLeft className="w-4 h-4" />}
      </Button>
    </aside>
  );
}
