import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardTopNav } from './DashboardTopNav';
import { storage } from '@/lib/store';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
  transparentNav?: boolean;
  navContentClassName?: string;
  mainClassName?: string;
  hideTopNavOnMobile?: boolean;
}

export function DashboardLayout({
  children,
  className,
  fullWidth = false,
  transparentNav = false,
  navContentClassName,
  mainClassName,
  hideTopNavOnMobile = false,
}: DashboardLayoutProps) {
  const navigate = useNavigate();
  const user = storage.getUser();

  useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <DashboardTopNav
        fullWidth={fullWidth}
        transparent={transparentNav}
        contentClassName={navContentClassName}
        hiddenOnMobile={hideTopNavOnMobile}
      />

      {/* Main Content */}
      <div className={cn(hideTopNavOnMobile ? 'pt-0 lg:pt-14' : 'pt-14')}>
        {/* Page Content */}
        <main
          className={cn(
            fullWidth ? 'w-full' : 'mx-auto max-w-7xl',
            'px-6 py-6',
            mainClassName,
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
