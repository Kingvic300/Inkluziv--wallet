import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AccessibleInput } from '@/components/AccessibleInput';
import { VoiceCommand } from '@/components/VoiceCommand';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mic, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, loginWithVoice } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await login(email, password);
      toast({
        title: "Welcome back!",
        description: "Successfully logged into your Inkluziv wallet"
      });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Please check your credentials and try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceLogin = async () => {
    setIsLoading(true);
    
    try {
      await loginWithVoice();
      toast({
        title: "Voice Login Successful!",
        description: "Welcome back to Inkluziv"
      });
    } catch (error) {
      toast({
        title: "Voice Login Failed",
        description: "Please try again or use traditional login",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceCommand = (command: string) => {
    if (command.toLowerCase().includes('login')) {
      handleVoiceLogin();
    }
  };

  return (
    <motion.form
      onSubmit={handleLogin}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="space-y-4">
        <AccessibleInput
          type="email"
          label="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          autoComplete="email"
          disabled={isLoading}
          aria-describedby="email-help"
        />
        <div id="email-help" className="sr-only">
          Enter the email address associated with your Inkluziv account
        </div>
        
        <div className="relative">
          <AccessibleInput
            type={showPassword ? "text" : "password"}
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            autoComplete="current-password"
            disabled={isLoading}
            aria-describedby="password-help"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-8 h-8 w-8 p-0"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        <div id="password-help" className="sr-only">
          Enter your account password
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Link
          to="/forgot-password"
          className="text-sm text-primary hover:text-primary/80 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
        >
          Forgot password?
        </Link>
      </div>

      <div className="space-y-3">
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
          aria-describedby="login-button-help"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            'Login to Inkluziv'
          )}
        </Button>
        <div id="login-button-help" className="sr-only">
          Click to login with your email and password
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleVoiceLogin}
            disabled={isLoading}
            className="w-full"
            aria-describedby="voice-login-help"
          >
            <Mic className="mr-2 h-4 w-4" />
            Voice Login
          </Button>
          <div id="voice-login-help" className="sr-only">
            Login using voice biometric authentication
          </div>
          
          <VoiceCommand
            onCommand={handleVoiceCommand}
            commands={['login']}
            triggerButton={
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                className="w-full"
                aria-describedby="voice-command-help"
              >
                <Mic className="mr-2 h-4 w-4" />
                Say "Login"
              </Button>
            }
          />
          <div id="voice-command-help" className="sr-only">
            Click and say "login" to trigger voice authentication
          </div>
        </div>
      </div>
    </motion.form>
  );
};