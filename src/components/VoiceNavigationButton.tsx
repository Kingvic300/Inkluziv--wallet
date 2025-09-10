import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { useVoiceRecognition } from "../hooks/useVoiceRecognition";
import { useAccessibility } from "../contexts/AccessibilityContext";
import { useToast } from "../hooks/use-toast";
import { cn } from "../lib/utils";

interface VoiceCommand {
  patterns: string[];
  action: () => void;
  description: string;
}

export const VoiceNavigationButton: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastCommand, setLastCommand] = useState("");
  const [walletContext, setWalletContext] = useState<any>(null); // store wallet transaction state

  const navigate = useNavigate();
  const location = useLocation();
  const voiceRecognition = useVoiceRecognition();
  const { settings, announceToScreenReader } = useAccessibility();
  const { toast } = useToast();

  /** ✅ Speak text aloud */
  const speak = (text: string) => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  /** ✅ Voice commands */
  const voiceCommands: VoiceCommand[] = [
    {
      patterns: ["wallet", "my wallet"],
      action: () => {
        navigate("/wallet");
        speak("You are now on the wallet page");
      },
      description: "Navigate to wallet page",
    },
    {
      patterns: ["transactions", "history"],
      action: () => {
        navigate("/transactions");
        speak("You are now on the transactions page");
      },
      description: "View transaction history",
    },
    {
      patterns: ["staking", "stake"],
      action: () => {
        navigate("/staking");
        speak("You are now on the staking dashboard");
      },
      description: "Open staking dashboard",
    },
    {
      patterns: ["send", "transfer"],
      action: () => {
        navigate("/wallet?action=send");
        speak("Who would you like to send tokens to?");
        setWalletContext({ step: "awaitingAddress" });
      },
      description: "Send tokens",
    },
  ];

  /** ✅ Match transcript */
  const findMatchingCommand = useCallback(
      (transcript: string): VoiceCommand | null => {
        const normalized = transcript.toLowerCase().trim();
        return (
            voiceCommands.find((cmd) =>
                cmd.patterns.some((p) => normalized.includes(p.toLowerCase()))
            ) || null
        );
      },
      [voiceCommands]
  );

  /** ✅ Handle wallet transaction flow */
  const handleWalletContext = (transcript: string) => {
    let ctx = walletContext;
    if (!ctx) return;

    if (ctx.step === "awaitingAddress") {
      setWalletContext({ step: "awaitingAmount", address: transcript });
      speak("How much would you like to send?");
      return;
    }

    if (ctx.step === "awaitingAmount") {
      const amount = parseFloat(transcript.replace(/[^0-9.]/g, ""));
      setWalletContext({ ...ctx, step: "awaitingCurrency", amount });
      speak("Which currency? For example, USDT or ETH.");
      return;
    }

    if (ctx.step === "awaitingCurrency") {
      const currency = transcript.toUpperCase();
      const success = true; // Simulate success
      const newBalance = Math.max(0, 1000 - ctx.amount); // Fake balance
      setWalletContext(null);

      if (success) {
        speak(
            `Successfully sent ${ctx.amount} ${currency} to ${ctx.address}. Your new balance is ${newBalance} ${currency}`
        );
        toast({
          title: "Transfer Successful",
          description: `Sent ${ctx.amount} ${currency} to ${ctx.address}. Balance: ${newBalance}`,
        });
      } else {
        speak("Transaction failed. Please try again later.");
        toast({
          title: "Transfer Failed",
          description: "An error occurred.",
          variant: "destructive",
        });
      }
      return;
    }
  };

  /** ✅ Process command */
  const processVoiceCommand = useCallback(
      (transcript: string) => {
        setIsProcessing(true);
        setLastCommand(transcript);

        if (walletContext) {
          handleWalletContext(transcript);
          setIsProcessing(false);
          return;
        }

        const matched = findMatchingCommand(transcript);
        if (matched) {
          announceToScreenReader(`Command recognized: ${matched.description}`);
          toast({
            title: "Voice Command Recognized",
            description: matched.description,
            duration: 2000,
          });

          setTimeout(() => {
            matched.action();
            setIsProcessing(false);
            setLastCommand("");
          }, 500);
        } else {
          speak("Command not recognized, please try again.");
          toast({
            title: "Command Not Recognized",
            description: "Try again with a different command",
            variant: "destructive",
          });
          setIsProcessing(false);
          setTimeout(() => setLastCommand(""), 2000);
        }
      },
      [walletContext, findMatchingCommand, announceToScreenReader, toast]
  );

  /** ✅ Start listening */
  const startListening = () => {
    if (!voiceRecognition.isSupported) {
      speak("Voice navigation not supported in this browser");
      return;
    }
    if (!settings.voiceEnabled) {
      speak("Voice commands are disabled. Enable them in settings.");
      return;
    }
    speak("Voice navigation activated. Listening...");
    voiceRecognition.startListening({ continuous: false, interimResults: false });
  };

  const stopListening = () => {
    voiceRecognition.stopListening();
    speak("Voice navigation stopped");
  };

  const handleClick = () => {
    voiceRecognition.isListening ? stopListening() : startListening();
  };

  useEffect(() => {
    if (
        voiceRecognition.transcript &&
        !voiceRecognition.isListening &&
        !isProcessing
    ) {
      processVoiceCommand(voiceRecognition.transcript);
    }
  }, [voiceRecognition.transcript, voiceRecognition.isListening, isProcessing]);

  return (
      <div>
        <Button onClick={handleClick}>
          {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
          ) : voiceRecognition.isListening ? (
              <Mic className="h-4 w-4" />
          ) : (
              <MicOff className="h-4 w-4" />
          )}
        </Button>
        <AnimatePresence>
          {lastCommand && (
              <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
              >
                <div className="p-2 bg-card border rounded text-sm">
                  {lastCommand}
                </div>
              </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
};
