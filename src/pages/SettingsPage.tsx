import React from 'react';
import { motion } from 'framer-motion';
import { AccessibilityControls } from '../components/AccessibilityControls';
import { useAccessibility } from '../contexts/AccessibilityContext';

export const SettingsPage: React.FC = () => {
  const { announceToScreenReader } = useAccessibility();

  React.useEffect(() => {
    announceToScreenReader('Settings page loaded. Configure your accessibility preferences and app settings.');
  }, [announceToScreenReader]);

  return (
    <motion.div
      className="container mx-auto px-4 py-6 space-y-6 max-w-4xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Page Header */}
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <h1 className="text-3xl font-bold text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Customize your Inkluziv experience with accessibility-first settings
        </p>
      </motion.div>

      {/* Accessibility Controls */}
      <AccessibilityControls />
    </motion.div>
  );
};