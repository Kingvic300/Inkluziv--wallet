import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
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
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  const startListening = useCallback(() => {
    // Check Web Speech API support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
      toast({
        title: "Voice Commands Not Supported",
        description: "Your browser doesn't support voice recognition",
        variant: "destructive"
      });
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      toast({
        title: "Listening...",
        description: `Say one of: ${commands.join(', ')}`,
        duration: 3000
      });
    };

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      
      // Check if the transcript matches any of the expected commands
      const matchedCommand = commands.find(command => 
        transcript.includes(command.toLowerCase())
      );

      if (matchedCommand) {
        toast({
          title: "Voice Command Detected",
          description: `Command: "${matchedCommand}"`,
          duration: 2000
        });
        
        // Update subtitle overlay
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
    };

    recognitionRef.current.onerror = (event: any) => {
      setIsListening(false);
      
      let errorMessage = "Voice recognition error";
      switch (event.error) {
        case 'no-speech':
          errorMessage = "No speech detected. Please try again.";
          break;
        case 'audio-capture':
          errorMessage = "Microphone access denied.";
          break;
        case 'not-allowed':
          errorMessage = "Microphone permission required.";
          break;
        default:
          errorMessage = `Voice recognition error: ${event.error}`;
      }
      
      toast({
        title: "Voice Command Error",
        description: errorMessage,
        variant: "destructive"
      });
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.start();
  }, [commands, onCommand, toast]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

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
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // If a custom trigger button is provided, clone it with onClick handler
  if (triggerButton) {
    return React.cloneElement(triggerButton as React.ReactElement, {
      onClick: handleClick,
      disabled: !isSupported || (triggerButton as React.ReactElement).props.disabled,
      'aria-label': `${(triggerButton as React.ReactElement).props['aria-label'] || 'Voice command'} - ${isListening ? 'Stop listening' : 'Start listening'}`
    });
  }

  return (
    <div className={className}>
      <motion.div
        animate={{ 
          scale: isListening ? 1.05 : 1,
        }}
        transition={{ 
          duration: 0.2,
          repeat: isListening ? Infinity : 0,
          repeatType: "reverse"
        }}
      >
        <Button
          onClick={handleClick}
          variant={isListening ? "default" : "outline"}
          size="icon"
          disabled={!isSupported}
          className={`relative ${isListening ? 'bg-red-500 hover:bg-red-600' : ''}`}
          aria-label={isListening ? "Stop voice command listening" : "Start voice command listening"}
          aria-pressed={isListening}
        >
          {isListening ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
          
          {/* Visual pulse effect when listening */}
          {isListening && (
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
      {isListening && (
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