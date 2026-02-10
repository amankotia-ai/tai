import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  List, 
  X, 
  CaretDown, 
  ShieldCheck, 
  Fingerprint, 
  FileText,
  SignIn,
  UserPlus,
  MagnifyingGlass
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Who We Are', href: '/about' },
    { 
      label: 'AI Protection', 
      dropdown: [
        { label: 'CastID', href: '/castid', icon: Fingerprint },
        { label: 'Licensing', href: '/licensing', icon: FileText },
      ]
    },
    { label: 'Network', href: '/network' },
    { label: 'Press', href: '/press' },
    { label: 'Research', href: '/research' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-primary" weight="duotone" />
            <span className="text-xl font-bold tracking-tight">
              theatre<span className="text-primary">.ai</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              item.dropdown ? (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-1 text-muted-foreground hover:text-foreground">
                      {item.label}
                      <CaretDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="bg-popover border-border">
                    {item.dropdown.map((subItem) => (
                      <DropdownMenuItem key={subItem.label} asChild>
                        <Link to={subItem.href} className="flex items-center gap-2 cursor-pointer">
                          <subItem.icon className="w-4 h-4" />
                          {subItem.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button key={item.label} variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
                  <Link to={item.href}>{item.label}</Link>
                </Button>
              )
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/search')} className="gap-2">
              <MagnifyingGlass className="w-4 h-4" />
              Global Search
            </Button>
            <Button variant="ghost" onClick={() => navigate('/signin')} className="gap-2">
              <SignIn className="w-4 h-4" />
              Sign In
            </Button>
            <Button onClick={() => navigate('/onboarding')} className="gap-2 glow-primary">
              <UserPlus className="w-4 h-4" />
              Join Now
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <List className="w-6 h-6" />}
          </Button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                item.dropdown ? (
                  <div key={item.label} className="space-y-1">
                    <span className="px-4 py-2 text-sm font-medium text-muted-foreground">{item.label}</span>
                    {item.dropdown.map((subItem) => (
                      <Link 
                        key={subItem.label}
                        to={subItem.href} 
                        className="flex items-center gap-2 px-6 py-2 text-foreground hover:bg-secondary rounded-lg"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <subItem.icon className="w-4 h-4" />
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link 
                    key={item.label}
                    to={item.href} 
                    className="px-4 py-2 text-foreground hover:bg-secondary rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              ))}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
                <Button variant="ghost" onClick={() => { navigate('/search'); setMobileMenuOpen(false); }}>
                  Global Search
                </Button>
                <Button variant="ghost" onClick={() => { navigate('/signin'); setMobileMenuOpen(false); }}>
                  Sign In
                </Button>
                <Button onClick={() => { navigate('/onboarding'); setMobileMenuOpen(false); }}>
                  Join Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
