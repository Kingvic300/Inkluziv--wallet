import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { useVoiceCommands } from '../hooks/useVoiceCommands';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { cn } from '../lib/utils';

export const VoiceCommandButton: React.FC = () => {
  const { isListening, transcript, isProcessing, startListening, stopListening } = useVoiceCommands();
  const { settings } = useAccessibility();

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const getButtonState = () => {
    if (isProcessing) return 'processing';
    if (isListening) return 'listening';
    return 'idle';
  };

  const buttonState = getButtonState();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20,
          duration: settings.reducedMotion ? 0 : undefined 
        }}
      >
        <Button
          onClick={handleClick}
          disabled={!settings.voiceEnabled || isProcessing}
          size="lg"
          className={cn(
            'h-16 w-16 rounded-full shadow-strong',
            'focus:ring-4 focus:ring-primary/50',
            'transition-all duration-300',
            buttonState === 'listening' && 'bg-gradient-primary animate-pulse-glow',
            buttonState === 'processing' && 'bg-accent',
            buttonState === 'idle' && 'bg-gradient-primary hover:shadow-medium'
          )}
          aria-label={
            isProcessing 
              ? 'Processing voice command'
              : isListening 
                ? 'Stop listening for voice commands'
                : 'Start voice command'
          }
          aria-describedby="voice-status"
        >
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div
                key="processing"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                exit={{ scale: 0 }}
                transition={{ duration: settings.reducedMotion ? 0 : 0.2 }}
              >
                <Loader2 className="h-6 w-6 animate-spin" />
              </motion.div>
            ) : isListening ? (
              <motion.div
                key="listening"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: settings.reducedMotion ? 0 : 0.2 }}
                className="animate-voice-pulse"
              >
                <Mic className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: settings.reducedMotion ? 0 : 0.2 }}
              >
                <MicOff className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Voice Status Overlay */}
      <AnimatePresence>
        {(isListening || isProcessing || transcript) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: settings.reducedMotion ? 0 : 0.2 }}
            className="fixed bottom-24 right-6 max-w-xs"
            id="voice-status"
          >
            <div className="bg-card border border-border rounded-lg p-4 shadow-medium">
              <div className="text-sm font-medium text-card-foreground mb-1">
                {isProcessing && 'Processing...'}
                {isListening && !isProcessing && 'Listening...'}
                {transcript && !isListening && !isProcessing && 'Command received'}
              </div>
              {transcript && (
                <div className="text-xs text-muted-foreground">
                  "{transcript}"
                </div>
              )}
              {isListening && !transcript && (
                <div className="text-xs text-muted-foreground">
                  Try: "check balance", "send tokens", "view transactions"
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};