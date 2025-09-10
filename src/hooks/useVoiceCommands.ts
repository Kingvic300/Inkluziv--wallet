import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAccessibility } from "../contexts/AccessibilityContext";
import { useVoiceRecognition } from "./useVoiceRecognition";

export interface VoiceCommand {
  command: string;
  action: () => void;
  description: string;
}

export const useVoiceCommands = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>("");
  const navigate = useNavigate();
  const { announceToScreenReader } = useAccessibility();
  const voiceRecognition = useVoiceRecognition();

  const commands: VoiceCommand[] = [
    { command: "check balance", action: () => navigate("/wallet"), description: "Navigate to wallet balance" },
    { command: "buy crypto", action: () => navigate("/fiat"), description: "Open fiat on/off ramp" },
    { command: "sell crypto", action: () => navigate("/fiat"), description: "Open fiat on/off ramp" },
    { command: "send tokens", action: () => navigate("/wallet?action=send"), description: "Open send tokens flow" },
    { command: "receive payment", action: () => navigate("/wallet?action=receive"), description: "Show receive address" },
    { command: "view transactions", action: () => navigate("/transactions"), description: "Open transaction history" },
    { command: "swap tokens", action: () => navigate("/swap"), description: "Open token swap interface" },
    { command: "stake tokens", action: () => navigate("/staking"), description: "Open staking dashboard" },
    { command: "go to dashboard", action: () => navigate("/"), description: "Return to main dashboard" },
    { command: "open settings", action: () => navigate("/settings"), description: "Open settings page" },
  ];

  /**
   * Process transcript and execute matching command
   */
  const processCommand = useCallback(
      (spoken: string) => {
        if (!spoken) return;

        setIsProcessing(true);
        setLastCommand(spoken);

        const normalized = spoken.toLowerCase().trim();

        const matchedCommand = commands.find(
            (cmd) =>
                normalized.includes(cmd.command.toLowerCase()) ||
                cmd.command.toLowerCase().includes(normalized)
        );

        if (matchedCommand) {
          announceToScreenReader(`Executing: ${matchedCommand.description}`);
          setTimeout(() => {
            matchedCommand.action();
            setTranscript("");
            setIsProcessing(false);
          }, 600);
        } else {
          announceToScreenReader(`Command "${spoken}" not recognized. Try again.`);
          setIsProcessing(false);
          setTimeout(() => setTranscript(""), 2000);
        }
      },
      [commands, announceToScreenReader]
  );

  /**
   * Toggle listening state
   */
  const toggleListening = useCallback(() => {
    if (!voiceRecognition.isSupported) {
      announceToScreenReader("Voice commands not supported in this browser");
      return;
    }

    if (isListening) {
      voiceRecognition.stopListening();
      setIsListening(false);
      announceToScreenReader("Voice command stopped");
    } else {
      setTranscript("");
      setIsProcessing(false);
      setLastCommand("");
      voiceRecognition.startListening({
        continuous: false,
        interimResults: true,
        timeout: 8000,
      });
      setIsListening(true);
      announceToScreenReader("Listening for voice command");
    }
  }, [isListening, voiceRecognition, announceToScreenReader]);

  /**
   * Execute command manually
   */
  const executeCommand = useCallback(
      (text: string) => {
        const cmd = commands.find((c) =>
            c.command.toLowerCase().includes(text.toLowerCase())
        );
        if (cmd) {
          cmd.action();
          announceToScreenReader(`Executed: ${cmd.description}`);
          return true;
        }
        return false;
      },
      [commands, announceToScreenReader]
  );

  // Process transcript after recognition ends
  useEffect(() => {
    if (voiceRecognition.transcript && !voiceRecognition.isListening && !isProcessing) {
      setTranscript(voiceRecognition.transcript);
      processCommand(voiceRecognition.transcript);
    }
  }, [voiceRecognition.transcript, voiceRecognition.isListening, isProcessing, processCommand]);

  // Sync listening state
  useEffect(() => {
    setIsListening(voiceRecognition.isListening);
  }, [voiceRecognition.isListening]);

  // Handle errors
  useEffect(() => {
    if (voiceRecognition.error) {
      setIsListening(false);
      setIsProcessing(false);
      announceToScreenReader(`Voice recognition error: ${voiceRecognition.error}`);
      setTimeout(() => voiceRecognition.resetTranscript(), 1500);
    }
  }, [voiceRecognition.error, voiceRecognition.resetTranscript, announceToScreenReader]);

  return {
    isSupported: voiceRecognition.isSupported,
    isListening,
    transcript,
    isProcessing,
    lastCommand,
    confidence: voiceRecognition.confidence,
    error: voiceRecognition.error,
    commands,
    toggleListening,
    executeCommand,
    resetTranscript: voiceRecognition.resetTranscript,
  };
};
