import React from 'react';
import { motion } from 'framer-motion';
import { HeroSection } from '@/components/HeroSection';
import { AuthTabs } from '@/components/AuthTabs';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Redirect to dashboard if already logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-8 h-screen"
      >
        <div className="absolute top-8 right-8 z-10">
          <DarkModeToggle />
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 h-full items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
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