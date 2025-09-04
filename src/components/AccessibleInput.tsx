import React, { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mic } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { cn } from '../lib/utils';

interface AccessibleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
  error?: string;
  showPasswordToggle?: boolean;
  voiceInputEnabled?: boolean;
  onVoiceInput?: (text: string) => void;
}

export const AccessibleInput = forwardRef<HTMLInputElement, AccessibleInputProps>(
  ({ 
    label, 
    description, 
    error, 
    showPasswordToggle = false, 
    voiceInputEnabled = false,
    onVoiceInput,
    className,
    type,
    id,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isListeningForVoice, setIsListeningForVoice] = useState(false);
    const { settings, announceToScreenReader } = useAccessibility();

    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const descriptionId = description ? `${inputId}-description` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;

    const inputType = showPasswordToggle && type === 'password' 
      ? (showPassword ? 'text' : 'password')
      : type;

    const handleVoiceInput = () => {
      if (!voiceInputEnabled || !onVoiceInput) return;
      
      setIsListeningForVoice(true);
      announceToScreenReader('Voice input started');
      
      // Mock voice input - in real app would use speech recognition
      setTimeout(() => {
        const mockInputs = ['0.5', '100', 'ethereum', 'send to alice'];
        const mockInput = mockInputs[Math.floor(Math.random() * mockInputs.length)];
        onVoiceInput(mockInput);
        setIsListeningForVoice(false);
        announceToScreenReader(`Voice input received: ${mockInput}`);
      }, 2000);
    };

    return (
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: settings.reducedMotion ? 0 : 0.2 }}
      >
        <Label 
          htmlFor={inputId}
          className="text-base font-medium text-foreground"
        >
          {label}
          {props.required && (
            <span className="text-destructive ml-1" aria-label="required">
              *
            </span>
          )}
        </Label>
        
        {description && (
          <p 
            id={descriptionId}
            className="text-sm text-muted-foreground"
          >
            {description}
          </p>
        )}

        <div className="relative">
          <Input
            {...props}
            ref={ref}
            id={inputId}
            type={inputType}
            className={cn(
              'min-h-touch text-base',
              'focus:ring-2 focus:ring-primary focus:border-primary',
              error && 'border-destructive focus:border-destructive focus:ring-destructive',
              voiceInputEnabled && 'pr-12',
              showPasswordToggle && !voiceInputEnabled && 'pr-12',
              showPasswordToggle && voiceInputEnabled && 'pr-20',
              className
            )}
            aria-describedby={cn(
              descriptionId,
              errorId
            ).trim() || undefined}
            aria-invalid={error ? 'true' : undefined}
          />

          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {voiceInputEnabled && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleVoiceInput}
                disabled={isListeningForVoice}
                className={cn(
                  'h-8 w-8 p-0',
                  isListeningForVoice && 'animate-pulse text-primary'
                )}
                aria-label="Voice input"
              >
                <Mic className="h-4 w-4" />
              </Button>
            )}

            {showPasswordToggle && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
                className="h-8 w-8 p-0"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>

        {error && (
          <motion.p
            id={errorId}
            className="text-sm text-destructive"
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: settings.reducedMotion ? 0 : 0.2 }}
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    );
  }
);

AccessibleInput.displayName = 'AccessibleInput';