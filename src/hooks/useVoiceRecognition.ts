import { useState, useCallback, useRef, useEffect } from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';

/**
 * Voice Recognition Hook
 * 
 * Provides real voice recognition functionality using the Web Speech API.
 * Handles browser compatibility, error states, and provides fallbacks.
 * 
 * Features:
 * - Real-time speech recognition
 * - Browser compatibility detection
 * - Error handling and recovery
 * - Accessibility announcements
 * - Automatic timeout handling
 */

interface VoiceRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  language?: string;
  maxAlternatives?: number;
  timeout?: number;
}

interface VoiceRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

interface UseVoiceRecognitionReturn {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  confidence: number;
  error: string | null;
  startListening: (options?: VoiceRecognitionOptions) => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export const useVoiceRecognition = (): UseVoiceRecognitionReturn => {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const { announceToScreenReader } = useAccessibility();

  // Check for Web Speech API support on mount
  useEffect(() => {
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;
    
    setIsSupported(!!SpeechRecognition);
    
    if (!SpeechRecognition) {
      console.warn('Web Speech API not supported in this browser');
    }
  }, []);

  /**
   * Initialize speech recognition with proper event handlers
   */
  const initializeRecognition = useCallback((options: VoiceRecognitionOptions = {}) => {
    if (!isSupported) {
      setError('Speech recognition not supported in this browser');
      return null;
    }

    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    
    // Configure recognition settings
    recognition.continuous = options.continuous ?? false;
    recognition.interimResults = options.interimResults ?? true;
    recognition.lang = options.language ?? 'en-US';
    recognition.maxAlternatives = options.maxAlternatives ?? 1;

    // Handle recognition start
    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      setTranscript('');
      setConfidence(0);
      announceToScreenReader('Voice recognition started. Please speak now.');
      
      // Set timeout to automatically stop recognition
      if (options.timeout) {
        timeoutRef.current = setTimeout(() => {
          recognition.stop();
          announceToScreenReader('Voice recognition timed out');
        }, options.timeout);
      }
    };

    // Handle recognition results
    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';
      let maxConfidence = 0;

      // Process all results
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcriptPart = result[0].transcript;
        const confidenceLevel = result[0].confidence || 0;

        if (result.isFinal) {
          finalTranscript += transcriptPart;
          maxConfidence = Math.max(maxConfidence, confidenceLevel);
        } else {
          interimTranscript += transcriptPart;
        }
      }

      // Update state with results
      const fullTranscript = finalTranscript || interimTranscript;
      setTranscript(fullTranscript);
      setConfidence(maxConfidence);

      // Announce final results to screen reader
      if (finalTranscript) {
        announceToScreenReader(`Voice input received: ${finalTranscript}`);
      }
    };

    // Handle recognition end
    recognition.onend = () => {
      setIsListening(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };

    // Handle recognition errors
    recognition.onerror = (event: any) => {
      setIsListening(false);
      setError(getErrorMessage(event.error));
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Announce error to screen reader
      announceToScreenReader(`Voice recognition error: ${getErrorMessage(event.error)}`);
    };

    return recognition;
  }, [isSupported, announceToScreenReader]);

  /**
   * Start voice recognition with optional configuration
   */
  const startListening = useCallback((options: VoiceRecognitionOptions = {}) => {
    if (isListening) {
      console.warn('Voice recognition already active');
      return;
    }

    if (!isSupported) {
      setError('Speech recognition not supported');
      announceToScreenReader('Speech recognition not supported in this browser');
      return;
    }

    try {
      const recognition = initializeRecognition({
        continuous: false,
        interimResults: true,
        language: 'en-US',
        timeout: 10000, // 10 second timeout
        ...options
      });

      if (recognition) {
        recognitionRef.current = recognition;
        recognition.start();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start voice recognition';
      setError(errorMessage);
      announceToScreenReader(`Voice recognition failed to start: ${errorMessage}`);
    }
  }, [isListening, isSupported, initializeRecognition, announceToScreenReader]);

  /**
   * Stop voice recognition
   */
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      announceToScreenReader('Voice recognition stopped');
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [isListening, announceToScreenReader]);

  /**
   * Reset transcript and error state
   */
  const resetTranscript = useCallback(() => {
    setTranscript('');
    setConfidence(0);
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isSupported,
    isListening,
    transcript,
    confidence,
    error,
    startListening,
    stopListening,
    resetTranscript
  };
};

/**
 * Convert speech recognition error codes to user-friendly messages
 */
function getErrorMessage(error: string): string {
  switch (error) {
    case 'no-speech':
      return 'No speech detected. Please try speaking again.';
    case 'audio-capture':
      return 'Microphone not accessible. Please check your microphone connection.';
    case 'not-allowed':
      return 'Microphone permission denied. Please allow microphone access.';
    case 'network':
      return 'Network error occurred. Please check your internet connection.';
    case 'service-not-allowed':
      return 'Speech recognition service not allowed. Please try again.';
    case 'bad-grammar':
      return 'Speech recognition grammar error.';
    case 'language-not-supported':
      return 'Language not supported for speech recognition.';
    default:
      return `Speech recognition error: ${error}`;
  }
}