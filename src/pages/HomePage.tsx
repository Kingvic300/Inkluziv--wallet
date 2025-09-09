import React from 'react';
import { motion } from 'framer-motion';
import { HeroSection } from '@/components/HeroSection';
import { AuthTabs } from '@/components/AuthTabs';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { Navigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { settings } = useAccessibility();

  // Redirect to dashboard if already logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Apply dark mode class to body for homepage
  React.useEffect(() => {
    if (settings.theme === 'dark' || settings.theme === 'high-contrast') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    
    return () => {
      document.body.classList.remove('dark');
    };
  }, [settings.theme]);
  return (
    <div className="min-h-screen bg-background dark">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-8 min-h-screen"
      >
        <div className="absolute top-8 right-8 z-10">
          <DarkModeToggle />
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 min-h-screen items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex flex-col items-center lg:items-start"
          >
            <motion.div 
              className="mb-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <img 
                src="https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop" 
                alt="Inkluziv - Voice-enabled accessible crypto wallet logo showing inclusivity and accessibility" 
                className="w-24 h-24 rounded-2xl shadow-strong border-2 border-primary/20"
              />
            </motion.div>
          >
            <HeroSection />
          </motion.div>
          
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <AuthTabs />
          </motion.div>
        </div>
        
        {/* Subtitle overlay placeholder for captions */}
        <div 
          className="fixed bottom-0 left-0 right-0 bg-primary/90 text-primary-foreground p-4 text-center transition-all duration-300 transform translate-y-full opacity-0"
          id="subtitle-overlay"
          role="status"
          aria-live="polite"
        >
          <p className="text-sm font-medium" id="subtitle-text">
            Accessibility captions will appear here
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;