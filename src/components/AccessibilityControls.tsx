import React from 'react';
import { motion } from 'framer-motion';
import { 
  Palette, 
  Type, 
  Volume2, 
  VolumeX, 
  Eye, 
  Zap,
  ZapOff,
  Settings
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useAccessibility } from '../contexts/AccessibilityContext';

export const AccessibilityControls: React.FC = () => {
  const { settings, updateSettings } = useAccessibility();

  const fontSizeOptions = [
    { value: 'small', label: 'Small (14px)' },
    { value: 'medium', label: 'Medium (16px)' },
    { value: 'large', label: 'Large (18px)' },
    { value: 'extra-large', label: 'Extra Large (22px)' },
  ];

  const themeOptions = [
    { value: 'dark', label: 'Dark Theme', icon: '🌙' },
    { value: 'light', label: 'Light Theme', icon: '☀️' },
    { value: 'high-contrast', label: 'High Contrast', icon: '⚡' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Visual Settings
          </CardTitle>
          <CardDescription>
            Customize the appearance to improve readability and comfort
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Selection */}
          <div className="space-y-3">
            <Label htmlFor="theme-select" className="text-base font-medium">
              Color Theme
            </Label>
            <Select 
              value={settings.theme} 
              onValueChange={(value: any) => updateSettings({ theme: value })}
            >
              <SelectTrigger id="theme-select" className="min-h-touch">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border shadow-medium">
                {themeOptions.map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                    className="min-h-touch hover:bg-muted focus:bg-muted"
                  >
                    <div className="flex items-center gap-2">
                      <span>{option.icon}</span>
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Font Size Selection */}
          <div className="space-y-3">
            <Label htmlFor="font-size-select" className="text-base font-medium">
              Text Size
            </Label>
            <Select 
              value={settings.fontSize} 
              onValueChange={(value: any) => updateSettings({ fontSize: value })}
            >
              <SelectTrigger id="font-size-select" className="min-h-touch">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border shadow-medium">
                {fontSizeOptions.map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                    className="min-h-touch hover:bg-muted focus:bg-muted"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Interaction Settings
          </CardTitle>
          <CardDescription>
            Configure how you interact with the app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Voice Commands Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="voice-toggle" className="text-base font-medium">
                Voice Commands
              </Label>
              <p className="text-sm text-muted-foreground">
                Enable voice-controlled navigation
              </p>
            </div>
            <div className="flex items-center gap-2">
              {settings.voiceEnabled ? (
                <Volume2 className="h-4 w-4 text-accent" />
              ) : (
                <VolumeX className="h-4 w-4 text-muted-foreground" />
              )}
              <Switch
                id="voice-toggle"
                checked={settings.voiceEnabled}
                onCheckedChange={(checked) => updateSettings({ voiceEnabled: checked })}
                className="data-[state=checked]:bg-accent"
              />
            </div>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="motion-toggle" className="text-base font-medium">
                Reduce Motion
              </Label>
              <p className="text-sm text-muted-foreground">
                Minimize animations and transitions
              </p>
            </div>
            <div className="flex items-center gap-2">
              {settings.reducedMotion ? (
                <ZapOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Zap className="h-4 w-4 text-accent" />
              )}
              <Switch
                id="motion-toggle"
                checked={settings.reducedMotion}
                onCheckedChange={(checked) => updateSettings({ reducedMotion: checked })}
                className="data-[state=checked]:bg-accent"
              />
            </div>
          </div>

          {/* Screen Reader Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="screen-reader-toggle" className="text-base font-medium">
                Screen Reader Mode
              </Label>
              <p className="text-sm text-muted-foreground">
                Optimize for screen reading software
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Eye className={`h-4 w-4 ${settings.screenReaderMode ? 'text-accent' : 'text-muted-foreground'}`} />
              <Switch
                id="screen-reader-toggle"
                checked={settings.screenReaderMode}
                onCheckedChange={(checked) => updateSettings({ screenReaderMode: checked })}
                className="data-[state=checked]:bg-accent"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common accessibility shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => updateSettings({ fontSize: 'extra-large', theme: 'high-contrast' })}
              className="min-h-touch flex items-center gap-2"
            >
              <Type className="h-4 w-4" />
              Maximum Readability
            </Button>
            <Button
              variant="outline"
              onClick={() => updateSettings({ 
                reducedMotion: true, 
                voiceEnabled: true, 
                screenReaderMode: true 
              })}
              className="min-h-touch flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Assistive Mode
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};