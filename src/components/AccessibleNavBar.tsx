import React from 'react';
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
  User
} from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
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
    to: '/',
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

  const handleNavClick = (item: NavItem) => {
    announceToScreenReader(`Navigating to ${item.label}: ${item.description}`);
  };

  const handleLogout = () => {
    announceToScreenReader('Logging out of Inkluziv');
    logout();
  };

  return (
    <motion.nav
      className="bg-card border-b border-border"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: settings.reducedMotion ? 0 : 0.3 }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: settings.reducedMotion ? 0 : 0.3, delay: 0.1 }}
          >
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">I</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Inkluziv
            </h1>
          </motion.div>

          {/* Navigation Links - Hidden on mobile, shown on desktop */}
          <div className="hidden md:flex items-center space-x-1">
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
                    <span>{item.label}</span>
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

          {/* User Menu */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: settings.reducedMotion ? 0 : 0.3, delay: 0.2 }}
          >
            {user && (
              <>
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-foreground">
                    {user.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>
                
                <Avatar className="h-10 w-10 border-2 border-primary/20">
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="hidden sm:flex"
                  aria-label="Logout from Inkluziv"
                >
                  Logout
                </Button>
              </>
            )}
          </motion.div>
        </div>

        {/* Mobile Navigation - Bottom Tab Style */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40">
          <div className="grid grid-cols-6 gap-1 p-2">
            {navItems.map((item) => {
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
                  <Icon className="h-5 w-5 mb-1" aria-hidden="true" />
                  <span className="text-[10px]">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};