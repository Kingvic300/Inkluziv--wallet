import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Wallet, 
  ArrowLeftRight, 
  Coins, 
  Banknote,
  History, 
  Settings,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useAuth } from '../contexts/AuthContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { cn } from '../lib/utils';

interface NavItem {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
}

const navItems: NavItem[] = [
  {
    to: '/dashboard',
    icon: Home,
    label: 'Dashboard',
    description: 'Main dashboard overview'
  },
  {
    to: '/wallet',
    icon: Wallet,
    label: 'Wallet',
    description: 'View balances and manage assets'
  },
  {
    to: '/swap',
    icon: ArrowLeftRight,
    label: 'Swap',
    description: 'Exchange tokens'
  },
  {
    to: '/fiat',
    icon: Banknote,
    label: 'Fiat',
    description: 'Buy/sell with NGN'
  },
  {
    to: '/staking',
    icon: Coins,
    label: 'Staking',
    description: 'Stake tokens to earn rewards'
  },
  {
    to: '/transactions',
    icon: History,
    label: 'Transactions',
    description: 'View transaction history'
  },
  {
    to: '/settings',
    icon: Settings,
    label: 'Settings',
    description: 'App settings and preferences'
  }
];

export const AccessibleNavBar: React.FC = () => {
  const { user, logout } = useAuth();
  const { settings, announceToScreenReader } = useAccessibility();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleNavClick = (item: NavItem) => {
    announceToScreenReader(`Navigating to ${item.label}: ${item.description}`);
  };

  const handleLogout = () => {
    announceToScreenReader('Logging out of Inkluziv');
    logout();
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const truncateEmail = (email: string, maxLength: number = 20) => {
    if (email.length <= maxLength) return email;
    return `${email.slice(0, maxLength)}...`;
  };

  return (
    <motion.nav
      className="bg-card border-b border-border sticky top-0 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: settings.reducedMotion ? 0 : 0.3 }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand - Always on left */}
          <motion.div 
            className="flex items-center gap-3 flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: settings.reducedMotion ? 0 : 0.3, delay: 0.1 }}
          >
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                className="text-primary-foreground"
                aria-hidden="true"
              >
                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.8"/>
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              INKLUZIV
            </h1>
          </motion.div>

          {/* Desktop Navigation Links - Hidden on mobile */}
          <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center max-w-2xl">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.to;
              const Icon = item.icon;
              
              return (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: settings.reducedMotion ? 0 : 0.2, 
                    delay: settings.reducedMotion ? 0 : index * 0.05 
                  }}
                >
                  <NavLink
                    to={item.to}
                    onClick={() => handleNavClick(item)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                        'min-h-touch focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      )
                    }
                    aria-describedby={`nav-${item.to.replace('/', '')}-description`}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden xl:inline">{item.label}</span>
                  </NavLink>
                  
                  {/* Screen reader description */}
                  <span 
                    id={`nav-${item.to.replace('/', '')}-description`}
                    className="sr-only"
                  >
                    {item.description}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* User Profile Section */}
          {user && (
            <motion.div 
              className="flex items-center gap-3 flex-shrink-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: settings.reducedMotion ? 0 : 0.3, delay: 0.2 }}
            >
              {/* Desktop User Info - Hidden on mobile/tablet */}
              <div className="hidden xl:flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground truncate max-w-32">
                    {user.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate max-w-32">
                    {truncateEmail(user.email)}
                  </p>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive transition-colors"
                  aria-label="Logout from Inkluziv"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden 2xl:inline">Logout</span>
                </Button>
              </div>

              {/* Mobile/Tablet Profile Dropdown */}
              <div className="xl:hidden">
                <DropdownMenu open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 p-2 hover:bg-muted transition-colors"
                      aria-label="Open user profile menu"
                      aria-expanded={isProfileOpen}
                    >
                      <Avatar className="h-8 w-8 border-2 border-primary/20">
                        <AvatarFallback className="bg-gradient-primary text-primary-foreground text-sm font-semibold">
                          {getUserInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isProfileOpen && "rotate-180"
                      )} />
                    </Button>
                  </DropdownMenuTrigger>
                  
                  <DropdownMenuContent 
                    align="end" 
                    className="w-64 bg-popover border border-border shadow-strong"
                    sideOffset={8}
                  >
                    <DropdownMenuLabel className="pb-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-primary/20">
                          <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                            {getUserInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Desktop Avatar - Always visible */}
              <div className="hidden xl:block">
                <Avatar className="h-10 w-10 border-2 border-primary/20">
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                    {getUserInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </motion.div>
          )}
        </div>

        {/* Mobile Navigation - Bottom Tab Style */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40">
          <div className="grid grid-cols-4 gap-1 p-2">
            {navItems.slice(0, 4).map((item) => {
              const isActive = location.pathname === item.to;
              const Icon = item.icon;
              
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => handleNavClick(item)}
                  className={cn(
                    'flex flex-col items-center justify-center p-3 rounded-md text-xs font-medium transition-colors',
                    'min-h-touch focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                  aria-label={`${item.label}: ${item.description}`}
                >
                  <Icon className="h-5 w-5 mb-1" aria-hidden="true" />
                  <span className="text-[10px] leading-tight">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
          
          {/* Secondary mobile nav for remaining items */}
          <div className="grid grid-cols-3 gap-1 p-2 pt-0 border-t border-border/50">
            {navItems.slice(4).map((item) => {
              const isActive = location.pathname === item.to;
              const Icon = item.icon;
              
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => handleNavClick(item)}
                  className={cn(
                    'flex flex-col items-center justify-center p-2 rounded-md text-xs font-medium transition-colors',
                    'min-h-touch focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                  aria-label={`${item.label}: ${item.description}`}
                >
                  <Icon className="h-4 w-4 mb-1" aria-hidden="true" />
                  <span className="text-[9px] leading-tight">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};