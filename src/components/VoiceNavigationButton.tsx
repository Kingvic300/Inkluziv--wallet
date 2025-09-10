import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useToast } from '../hooks/use-toast';
import { cn } from '../lib/utils';

interface VoiceNavigationButtonProps {
  className?: string;
  size?: 'sm' | 'default' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
}

interface VoiceCommand {
  patterns: string[];
  action: () => void;
  description: string;
}

export const VoiceNavigationButton: React.FC<VoiceNavigationButtonProps> = ({
  className,
  size = 'default',
  variant = 'default'
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>('');
  
  const navigate = useNavigate();
  const voiceRecognition = useVoiceRecognition();
  const { settings, announceToScreenReader } = useAccessibility();
  const { toast } = useToast();

  // Define voice commands with multiple patterns for better recognition
  const voiceCommands: VoiceCommand[] = [
    {
      patterns: ['wallet', 'go to wallet', 'open wallet', 'show wallet', 'my wallet', 'check balance'],
      action: () => navigate('/wallet'),
      description: 'Navigate to wallet page'
    },
    {
      patterns: ['transactions', 'transaction history', 'show transactions', 'view transactions', 'history', 'tx history'],
      action: () => navigate('/transactions'),
      description: 'View transaction history'
    },
    {
      patterns: ['staking', 'stake', 'staking dashboard', 'go to staking', 'stake tokens', 'earn rewards'],
      action: () => navigate('/staking'),
      description: 'Open staking dashboard'
    },
    {
      patterns: ['fiat', 'buy crypto', 'sell crypto', 'fiat gateway', 'buy sell', 'naira', 'ngn'],
      action: () => navigate('/fiat'),
      description: 'Open fiat on/off ramp'
    },
    {
      patterns: ['swap', 'swap tokens', 'exchange', 'trade', 'token swap', 'convert'],
      action: () => navigate('/swap'),
      description: 'Open token swap interface'
    },
    {
      patterns: ['dashboard', 'home', 'go home', 'main page', 'overview', 'main dashboard'],
      action: () => navigate('/dashboard'),
      description: 'Return to dashboard'
    },
    {
      patterns: ['settings', 'preferences', 'configuration', 'options', 'accessibility'],
      action: () => navigate('/settings'),
      description: 'Open settings page'
    },
    {
      patterns: ['send', 'send tokens', 'transfer', 'send money', 'send crypto'],
      action: () => navigate('/wallet?action=send'),
      description: 'Open send tokens flow'
    },
    {
      patterns: ['receive', 'receive tokens', 'get paid', 'receive payment', 'receive crypto'],
      action: () => navigate('/wallet?action=receive'),
      description: 'Show receive address'
    }
  ];

  /**
   * Find matching command based on transcript
   */
  const findMatchingCommand = useCallback((transcript: string): VoiceCommand | null => {
    const normalizedTranscript = transcript.toLowerCase().trim();
    
    return voiceCommands.find(command =>
      command.patterns.some(pattern =>
        normalizedTranscript.includes(pattern.toLowerCase()) ||
        pattern.toLowerCase().includes(normalizedTranscript)
      )
    ) || null;
  }, [voiceCommands]);

  /**
   * Process voice command and execute action
   */
  const processVoiceCommand = useCallback((transcript: string) => {
    setIsProcessing(true);
    setLastCommand(transcript);
    
    const matchedCommand = findMatchingCommand(transcript);
    
    if (matchedCommand) {
      announceToScreenReader(`Command recognized: ${matchedCommand.description}`);
      
      toast({
        title: 'Voice Command Recognized',
        description: matchedCommand.description,
        duration: 2000
      });
      
      // Execute command after brief delay for user feedback
      setTimeout(() => {
        matchedCommand.action();
        setIsProcessing(false);
        setLastCommand('');
      }, 1000);
    } else {
      announceToScreenReader('Command not recognized, please try again.');
      
      toast({
        title: 'Command Not Recognized',
        description: 'Please try again with a different command',
        variant: 'destructive',
        duration: 3000
      });
      
      setIsProcessing(false);
      
      // Clear command after showing error
      setTimeout(() => {
        setLastCommand('');
      }, 3000);
    }
  }, [findMatchingCommand, announceToScreenReader, toast]);

  /**
   * Start voice recognition
   */
  const startListening = useCallback(() => {
    if (!voiceRecognition.isSupported) {
      announceToScreenReader('Voice navigation not supported in this browser');
      toast({
        title: 'Voice Navigation Unavailable',
        description: 'Your browser does not support voice recognition',
        variant: 'destructive'
      });
      return;
    }

    if (!settings.voiceEnabled) {
      announceToScreenReader('Voice commands are disabled. Enable them in settings.');
      toast({
        title: 'Voice Commands Disabled',
        description: 'Enable voice commands in accessibility settings',
        variant: 'destructive'
      });
      return;
    }

    announceToScreenReader('Voice navigation activated. Listening for commands.');
    
    voiceRecognition.startListening({
      continuous: false,
      interimResults: true,
        timeout: 10000 // 10 second timeout
    });
  }, [voiceRecognition, settings.voiceEnabled, announceToScreenReader, toast]);

  /**
   * Stop voice recognition
   */
  const stopListening = useCallback(() => {
    voiceRecognition.stopListening();
    announceToScreenReader('Voice navigation stopped');
  }, [voiceRecognition, announceToScreenReader]);

  /**
   * Handle button click
   */
  const handleClick = useCallback(() => {
    if (voiceRecognition.isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [voiceRecognition.isListening, startListening, stopListening]);

  // Process transcript when recognition completes
  useEffect(() => {
    if (voiceRecognition.transcript && !voiceRecognition.isListening && !isProcessing) {
      processVoiceCommand(voiceRecognition.transcript);
    }
  }, [voiceRecognition.transcript, voiceRecognition.isListening, isProcessing, processVoiceCommand]);

  // Handle voice recognition errors
  useEffect(() => {
    if (voiceRecognition.error) {
      setIsProcessing(false);
      announceToScreenReader(`Voice recognition error: ${voiceRecognition.error}`);
      
      toast({
        title: 'Voice Recognition Error',
        description: voiceRecognition.error,
        variant: 'destructive'
      });
      
      // Clear error after announcement
      setTimeout(() => {
        voiceRecognition.resetTranscript();
      }, 2000);
    }
  }, [voiceRecognition.error, voiceRecognition.resetTranscript, announceToScreenReader, toast]);

  // Don't render if voice recognition is not supported
  if (!voiceRecognition.isSupported) {
    return null;
  }

  const getButtonState = () => {
    if (isProcessing) return 'processing';
    if (voiceRecognition.isListening) return 'listening';
    return 'idle';
  };

  const buttonState = getButtonState();

  return (
    <div className={cn('relative', className)}>
      <motion.div
        animate={{
          scale: buttonState === 'listening' ? 1.05 : 1,
        }}
        transition={{
          duration: 0.2,
          repeat: buttonState === 'listening' ? Infinity : 0,
          repeatType: 'reverse'
        }}
      >
        <Button
          onClick={handleClick}
          disabled={!settings.voiceEnabled || isProcessing}
          size={size}
          variant={variant}
          className={cn(
            'relative transition-all duration-300',
            buttonState === 'listening' && 'bg-primary animate-pulse-glow shadow-strong',
            buttonState === 'processing' && 'bg-accent',
            voiceRecognition.error && 'bg-destructive',
            'focus:ring-4 focus:ring-primary/50'
          )}
          aria-label="Activate voice navigation"
          aria-pressed={voiceRecognition.isListening}
          aria-describedby="voice-nav-status"
        >
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div
                key="processing"
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                exit={{ scale: 0 }}
                transition={{ duration: settings.reducedMotion ? 0 : 0.3 }}
              >
                <Loader2 className="h-4 w-4 animate-spin" />
              </motion.div>
            ) : voiceRecognition.isListening ? (
              <motion.div
                key="listening"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: settings.reducedMotion ? 0 : 0.2 }}
                className="animate-voice-pulse"
              >
                <Mic className="h-4 w-4" />
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: settings.reducedMotion ? 0 : 0.2 }}
              >
                <MicOff className="h-4 w-4" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Visual pulse effect when listening */}
          {buttonState === 'listening' && (
            <motion.div
              className="absolute inset-0 rounded-md bg-primary/30"
              initial={{ scale: 1, opacity: 0.7 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'easeOut'
              }}
            />
          )}
        </Button>
      </motion.div>

      {/* Status indicator for screen readers */}
      <div
        id="voice-nav-status"
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        {buttonState === 'listening' && 'Voice navigation listening for commands'}
        {buttonState === 'processing' && `Processing command: ${lastCommand}`}
        {voiceRecognition.error && `Voice error: ${voiceRecognition.error}`}
      </div>

      {/* Visual status overlay */}
      <AnimatePresence>
        {(voiceRecognition.isListening || isProcessing || lastCommand || voiceRecognition.error) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: settings.reducedMotion ? 0 : 0.2 }}
            className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className={cn(
              'bg-card border rounded-lg p-3 shadow-medium min-w-48 text-center',
              voiceRecognition.error ? 'border-destructive bg-destructive/5' : 'border-border'
            )}>
              <div className="text-sm font-medium text-card-foreground mb-1">
                {voiceRecognition.error && 'Voice Error'}
                {!voiceRecognition.error && isProcessing && 'Processing...'}
                {!voiceRecognition.error && voiceRecognition.isListening && !isProcessing && 'Listening...'}
                {!voiceRecognition.error && lastCommand && !voiceRecognition.isListening && !isProcessing && 'Command Received'}
              </div>
              
              {voiceRecognition.error && (
                <div className="text-xs text-destructive">
                  {voiceRecognition.error}
                </div>
              )}
              
              {lastCommand && !voiceRecognition.error && (
                <div className="text-xs text-muted-foreground">
                  "{lastCommand}"
                </div>
              )}
              
              {voiceRecognition.isListening && !lastCommand && !voiceRecognition.error && (
                <div className="text-xs text-muted-foreground">
                  Try: "wallet", "swap", "transactions"
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};