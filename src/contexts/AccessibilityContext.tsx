import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  theme: 'light' | 'dark' | 'high-contrast';
  reducedMotion: boolean;
  voiceEnabled: boolean;
  screenReaderMode: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  announceToScreenReader: (message: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 'medium',
    theme: 'light',
    reducedMotion: false,
    voiceEnabled: true,
    screenReaderMode: false,
  });

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    root.className = '';
    
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'high-contrast') {
      root.classList.add('high-contrast');
    }

    // Apply font size
    root.style.fontSize = {
      'small': '14px',
      'medium': '16px',
      'large': '18px',
      'extra-large': '22px'
    }[settings.fontSize];

    // Set reduced motion preference
    if (settings.reducedMotion) {
      root.style.setProperty('--transition-smooth', 'none');
      root.style.setProperty('--transition-bounce', 'none');
    } else {
      root.style.removeProperty('--transition-smooth');
      root.style.removeProperty('--transition-bounce');
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings, announceToScreenReader }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};