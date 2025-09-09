import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { useToast } from '@/hooks/use-toast';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceCommandProps {
  onCommand: (command: string) => void;
  commands: string[];
  triggerButton?: React.ReactNode;
  className?: string;
}

export const VoiceCommand: React.FC<VoiceCommandProps> = ({
  onCommand,
  commands,
  triggerButton,
  className = ""
}) => {
  const voiceRecognition = useVoiceRecognition();
  const { toast } = useToast();

  const handleStartListening = useCallback(() => {
    if (!voiceRecognition.isSupported) {
      toast({
        title: "Voice Commands Not Supported",
        description: "Your browser doesn't support voice recognition",
        variant: "destructive"
      });
      return;
    }

    voiceRecognition.startListening({
      continuous: false,
      interimResults: false,
      timeout: 5000
    });
    
    toast({
      title: "Listening...",
      description: `Say one of: ${commands.join(', ')}`,
      duration: 3000
    });
  }, [voiceRecognition, commands, toast]);

  const handleStopListening = useCallback(() => {
    voiceRecognition.stopListening();
  }, [voiceRecognition]);

  // Handle voice recognition results
  React.useEffect(() => {
    if (voiceRecognition.transcript && !voiceRecognition.isListening) {
      const transcript = voiceRecognition.transcript.toLowerCase().trim();
      
      const matchedCommand = commands.find(command => 
        transcript.includes(command.toLowerCase())
      );

      if (matchedCommand) {
        toast({
          title: "Voice Command Detected",
          description: `Command: "${matchedCommand}"`,
          duration: 2000
        });
        
        updateSubtitleOverlay(`Voice command detected: ${matchedCommand}`);
        onCommand(transcript);
      } else {
        toast({
          title: "Command Not Recognized",
          description: `Try saying: ${commands.join(', ')}`,
          variant: "destructive"
        });
        
        updateSubtitleOverlay(`Command not recognized. Try: ${commands.join(', ')}`);
      }
      
      voiceRecognition.resetTranscript();
    }
  }, [voiceRecognition.transcript, voiceRecognition.isListening, commands, onCommand, toast, voiceRecognition]);

  // Handle voice recognition errors
  React.useEffect(() => {
    if (voiceRecognition.error) {
      toast({
        title: "Voice Command Error",
        description: voiceRecognition.error,
        variant: "destructive"
      });
    }
  }, [voiceRecognition.error, toast]);

  const updateSubtitleOverlay = (text: string) => {
    const overlay = document.getElementById('subtitle-overlay');
    const textElement = document.getElementById('subtitle-text');
    if (overlay && textElement) {
      textElement.textContent = text;
      overlay.classList.remove('translate-y-full', 'opacity-0');
      overlay.classList.add('translate-y-0', 'opacity-100');
      
      setTimeout(() => {
        overlay.classList.add('translate-y-full', 'opacity-0');
        overlay.classList.remove('translate-y-0', 'opacity-100');
      }, 4000);
    }
  };

  const handleClick = () => {
    if (voiceRecognition.isListening) {
      handleStopListening();
    } else {
      handleStartListening();
    }
  };

  // If a custom trigger button is provided, clone it with onClick handler
  if (triggerButton) {
    return React.cloneElement(triggerButton as React.ReactElement, {
      onClick: handleClick,
      disabled: !voiceRecognition.isSupported || (triggerButton as React.ReactElement).props.disabled,
      'aria-label': `${(triggerButton as React.ReactElement).props['aria-label'] || 'Voice command'} - ${voiceRecognition.isListening ? 'Stop listening' : 'Start listening'}`
    });
  }

  return (
    <div className={className}>
      <motion.div
        animate={{ 
          scale: voiceRecognition.isListening ? 1.05 : 1,
        }}
        transition={{ 
          duration: 0.2,
          repeat: voiceRecognition.isListening ? Infinity : 0,
          repeatType: "reverse"
        }}
      >
        <Button
          onClick={handleClick}
          variant={voiceRecognition.isListening ? "default" : "outline"}
          size="icon"
          disabled={!voiceRecognition.isSupported}
          className={`relative ${voiceRecognition.isListening ? 'bg-red-500 hover:bg-red-600' : ''}`}
          aria-label={voiceRecognition.isListening ? "Stop voice command listening" : "Start voice command listening"}
          aria-pressed={voiceRecognition.isListening}
        >
          {voiceRecognition.isListening ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
          
          {/* Visual pulse effect when listening */}
          {voiceRecognition.isListening && (
            <motion.div
              className="absolute inset-0 rounded-md bg-red-500/30"
              initial={{ scale: 1, opacity: 0.7 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          )}
        </Button>
      </motion.div>
      
      {/* Audio feedback indicator */}
      {voiceRecognition.isListening && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute -top-2 -right-2"
        >
          <Volume2 className="h-3 w-3 text-primary animate-pulse" />
        </motion.div>
      )}
    </div>
  );
};