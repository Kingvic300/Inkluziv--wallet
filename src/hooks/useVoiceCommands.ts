import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useVoiceRecognition } from './useVoiceRecognition';

export interface VoiceCommand {
  command: string;
  action: () => void;
  description: string;
}

export const useVoiceCommands = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>('');
  const navigate = useNavigate();
  const { announceToScreenReader } = useAccessibility();
  
  const voiceRecognition = useVoiceRecognition();

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

  /**
   * Process voice command and execute corresponding action
   */
  const processCommand = useCallback((transcript: string) => {
    setIsProcessing(true);
    setLastCommand(transcript);
    
    // Find matching command (case-insensitive, partial match)
    const matchedCommand = commands.find(cmd => 
      transcript.toLowerCase().includes(cmd.command.toLowerCase()) ||
      cmd.command.toLowerCase().includes(transcript.toLowerCase())
    );
    
    if (matchedCommand) {
      announceToScreenReader(`Executing command: ${matchedCommand.description}`);
      
      // Execute command after brief delay for user feedback
      setTimeout(() => {
        matchedCommand.action();
        setIsProcessing(false);
        setTranscript('');
        setLastCommand('');
      }, 1000);
    } else {
      announceToScreenReader(`Command "${transcript}" not recognized. Please try again.`);
      setIsProcessing(false);
      
      // Clear transcript after showing error
      setTimeout(() => {
        setTranscript('');
        setLastCommand('');
      }, 3000);
    }
  }, [commands, announceToScreenReader]);

  /**
   * Start listening for voice commands
   */
  const startListening = useCallback(() => {
    if (isListening || !voiceRecognition.isSupported) {
      if (!voiceRecognition.isSupported) {
        announceToScreenReader('Voice commands not supported in this browser');
      }
      return;
    }
    
    setIsListening(true);
    setTranscript('');
    setIsProcessing(false);
    setLastCommand('');
    announceToScreenReader('Voice command listening started');
    
    // Start real voice recognition
    voiceRecognition.startListening({
      continuous: false,
      interimResults: true,
      timeout: 8000 // 8 second timeout
    });
  }, [isListening, voiceRecognition, announceToScreenReader]);

  /**
   * Stop listening for voice commands
   */
  const stopListening = useCallback(() => {
    voiceRecognition.stopListening();
    announceToScreenReader('Voice command stopped');
  }, [voiceRecognition, announceToScreenReader]);

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

  // Sync with voice recognition state
  useEffect(() => {
    setIsListening(voiceRecognition.isListening);
  }, [voiceRecognition.isListening]);

  // Process transcript when recognition completes
  useEffect(() => {
    if (voiceRecognition.transcript && !voiceRecognition.isListening && !isProcessing) {
      setTranscript(voiceRecognition.transcript);
      processCommand(voiceRecognition.transcript);
    }
  }, [voiceRecognition.transcript, voiceRecognition.isListening, isProcessing, processCommand]);

  // Handle voice recognition errors
  useEffect(() => {
    if (voiceRecognition.error) {
      setIsListening(false);
      setIsProcessing(false);
      announceToScreenReader(`Voice recognition error: ${voiceRecognition.error}`);
      
      // Clear error after announcement
      setTimeout(() => {
        voiceRecognition.resetTranscript();
      }, 2000);
    }
  }, [voiceRecognition.error, voiceRecognition.resetTranscript, announceToScreenReader]);

  // Update transcript display
  useEffect(() => {
    if (voiceRecognition.transcript && voiceRecognition.isListening) {
      setTranscript(voiceRecognition.transcript);
      }
  }, [voiceRecognition.transcript, voiceRecognition.isListening]);

  return {
    isSupported: voiceRecognition.isSupported,
    isListening,
    transcript,
    isProcessing,
    lastCommand,
    confidence: voiceRecognition.confidence,
    error: voiceRecognition.error,
    commands,
    startListening,
    stopListening,
    executeCommand,
    resetTranscript: voiceRecognition.resetTranscript
  };
};