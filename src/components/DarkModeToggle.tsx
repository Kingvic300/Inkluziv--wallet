import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const DarkModeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check localStorage and system preference on mount
    const stored = localStorage.getItem('inkluziv-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldBeDark = stored === 'dark' || (!stored && systemPrefersDark);
    setIsDark(shouldBeDark);
    
    // Apply theme to document
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    // Update DOM and localStorage
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('inkluziv-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('inkluziv-theme', 'light');
    }
    
    // Provide feedback
    toast({
      title: `Switched to ${newTheme ? 'Dark' : 'Light'} Mode`,
      description: "Theme preference saved",
      duration: 2000
    });
    
    // Update subtitle overlay for accessibility
    const overlay = document.getElementById('subtitle-overlay');
    const text = document.getElementById('subtitle-text');
    if (overlay && text) {
      text.textContent = `Theme switched to ${newTheme ? 'dark' : 'light'} mode`;
      overlay.classList.remove('translate-y-full', 'opacity-0');
      overlay.classList.add('translate-y-0', 'opacity-100');
      
      setTimeout(() => {
        overlay.classList.add('translate-y-full', 'opacity-0');
        overlay.classList.remove('translate-y-0', 'opacity-100');
      }, 3000);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={toggleTheme}
        className="relative overflow-hidden"
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        aria-pressed={isDark}
      >
        <motion.div
          initial={false}
          animate={{
            scale: isDark ? 0 : 1,
            rotate: isDark ? 90 : 0
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Sun className="h-4 w-4" />
        </motion.div>
        
        <motion.div
          initial={false}
          animate={{
            scale: isDark ? 1 : 0,
            rotate: isDark ? 0 : -90
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Moon className="h-4 w-4" />
        </motion.div>
      </Button>
    </motion.div>
  );
};