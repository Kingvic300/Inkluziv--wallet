import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '../contexts/AccessibilityContext';

export interface VoiceCommand {
  command: string;
  action: () => void;
  description: string;
}

export const useVoiceCommands = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { announceToScreenReader } = useAccessibility();
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Mock voice commands
  const commands: VoiceCommand[] = [
    {
      command: 'check balance',
      action: () => navigate('/wallet'),
      description: 'Navigate to wallet balance'
    },
    {
      command: 'buy crypto',
      action: () => navigate('/fiat'),
      description: 'Open fiat on/off ramp'
    },
    {
      command: 'sell crypto',
      action: () => navigate('/fiat'),
      description: 'Open fiat on/off ramp'
    },
    {
      command: 'send tokens',
      action: () => navigate('/wallet?action=send'),
      description: 'Open send tokens flow'
    },
    {
      command: 'receive payment',
      action: () => navigate('/wallet?action=receive'),
      description: 'Show receive address'
    },
    {
      command: 'view transactions',
      action: () => navigate('/transactions'),
      description: 'Open transaction history'
    },
    {
      command: 'swap tokens',
      action: () => navigate('/swap'),
      description: 'Open token swap interface'
    },
    {
      command: 'stake tokens',
      action: () => navigate('/staking'),
      description: 'Open staking dashboard'
    },
    {
      command: 'go to dashboard',
      action: () => navigate('/'),
      description: 'Return to main dashboard'
    },
    {
      command: 'open settings',
      action: () => navigate('/settings'),
      description: 'Open settings page'
    },
  ];

  const mockVoiceRecognition = useCallback((duration: number = 3000) => {
    const mockTranscripts = [
      'check balance',
      'buy crypto',
      'sell crypto',
      'send tokens', 
      'view transactions',
      'swap tokens',
      'stake tokens',
      'go to dashboard',
      'open settings',
      'receive payment'
    ];
    
    const randomTranscript = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
    
    setTimeout(() => {
      setTranscript(randomTranscript);
      setIsListening(false);
      setIsProcessing(true);
      
      // Process the command
      const matchedCommand = commands.find(cmd => 
        cmd.command.toLowerCase() === randomTranscript.toLowerCase()
      );
      
      if (matchedCommand) {
        announceToScreenReader(`Executing command: ${matchedCommand.description}`);
        setTimeout(() => {
          matchedCommand.action();
          setIsProcessing(false);
          setTranscript('');
        }, 1000);
      } else {
        announceToScreenReader('Command not recognized. Please try again.');
        setIsProcessing(false);
        setTranscript('');
      }
    }, duration);
  }, [commands, announceToScreenReader]);

  const startListening = useCallback(() => {
    if (isListening) return;
    
    setIsListening(true);
    setTranscript('');
    setIsProcessing(false);
    announceToScreenReader('Voice command listening started');
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Start mock voice recognition
    mockVoiceRecognition();
    
    // Auto-stop after 5 seconds
    timeoutRef.current = setTimeout(() => {
      if (isListening) {
        stopListening();
        announceToScreenReader('Voice command timeout');
      }
    }, 5000);
  }, [isListening, mockVoiceRecognition, announceToScreenReader]);

  const stopListening = useCallback(() => {
    setIsListening(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    announceToScreenReader('Voice command stopped');
  }, [announceToScreenReader]);

  const executeCommand = useCallback((commandText: string) => {
    const matchedCommand = commands.find(cmd => 
      cmd.command.toLowerCase().includes(commandText.toLowerCase())
    );
    
    if (matchedCommand) {
      matchedCommand.action();
      announceToScreenReader(`Executed: ${matchedCommand.description}`);
      return true;
    }
    return false;
  }, [commands, announceToScreenReader]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    isProcessing,
    commands,
    startListening,
    stopListening,
    executeCommand,
  };
};