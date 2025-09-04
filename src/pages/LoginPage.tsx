import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { 
  Mic, 
  User, 
  Lock, 
  Eye,
  Loader2,
  Shield,
  CheckCircle 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { AccessibleInput } from '../components/AccessibleInput';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useAuth } from '../contexts/AuthContext';
import { useAccessibility } from '../contexts/AccessibilityContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMethod, setLoginMethod] = useState<'email' | 'voice'>('email');
  const [voiceSetupStep, setVoiceSetupStep] = useState<'record' | 'verify' | 'complete'>('record');
  const [isRecording, setIsRecording] = useState(false);
  
  const { login, loginWithVoice, isAuthenticated, isLoading } = useAuth();
  const { announceToScreenReader } = useAccessibility();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    try {
      await login(email, password);
      announceToScreenReader('Login successful');
    } catch (error) {
      announceToScreenReader('Login failed. Please check your credentials.');
    }
  };

  const handleVoiceLogin = async () => {
    try {
      await loginWithVoice();
      announceToScreenReader('Voice login successful');
    } catch (error) {
      announceToScreenReader('Voice login failed. Please try again.');
    }
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    announceToScreenReader('Voice recording started. Please say your passphrase.');
    
    // Mock voice recording
    setTimeout(() => {
      setIsRecording(false);
      setVoiceSetupStep('verify');
      announceToScreenReader('Voice sample recorded. Please verify by saying your passphrase again.');
    }, 3000);
  };

  const verifyVoice = () => {
    setIsRecording(true);
    announceToScreenReader('Voice verification started.');
    
    // Mock voice verification
    setTimeout(() => {
      setIsRecording(false);
      setVoiceSetupStep('complete');
      announceToScreenReader('Voice biometric setup completed successfully.');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Logo and Header */}
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-2xl">I</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Inkluziv
            </h1>
            <p className="text-muted-foreground">
              Accessible Crypto Wallet
            </p>
          </div>
        </motion.div>

        {/* Login Methods Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Choose your preferred authentication method
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Login Method Selection */}
              <div className="flex bg-muted p-1 rounded-lg">
                <Button
                  variant={loginMethod === 'email' ? 'default' : 'ghost'}
                  onClick={() => setLoginMethod('email')}
                  className="flex-1"
                >
                  <User className="h-4 w-4 mr-2" />
                  Email
                </Button>
                <Button
                  variant={loginMethod === 'voice' ? 'default' : 'ghost'}
                  onClick={() => setLoginMethod('voice')}
                  className="flex-1"
                >
                  <Mic className="h-4 w-4 mr-2" />
                  Voice
                </Button>
              </div>

              {/* Email Login Form */}
              {loginMethod === 'email' && (
                <motion.form
                  onSubmit={handleEmailLogin}
                  className="space-y-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <AccessibleInput
                    label="Email address"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    voiceInputEnabled
                    onVoiceInput={setEmail}
                    required
                    autoComplete="email"
                  />

                  <AccessibleInput
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    showPasswordToggle
                    required
                    autoComplete="current-password"
                  />

                  <Button 
                    type="submit" 
                    className="w-full min-h-touch"
                    disabled={isLoading || !email || !password}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Signing in...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Sign In with Email
                      </div>
                    )}
                  </Button>
                </motion.form>
              )}

              {/* Voice Login Interface */}
              {loginMethod === 'voice' && (
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {voiceSetupStep === 'record' && (
                    <div className="text-center space-y-4">
                      <div className="mx-auto w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center">
                        <Mic className={`h-12 w-12 text-primary-foreground ${isRecording ? 'animate-pulse' : ''}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Voice Authentication</h3>
                        <p className="text-sm text-muted-foreground mt-2">
                          Click the button below and say your voice passphrase to authenticate
                        </p>
                      </div>
                      <Button
                        onClick={startVoiceRecording}
                        disabled={isRecording}
                        className="w-full min-h-touch"
                      >
                        {isRecording ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Recording...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Mic className="h-4 w-4" />
                            Start Voice Authentication
                          </div>
                        )}
                      </Button>
                    </div>
                  )}

                  {voiceSetupStep === 'verify' && (
                    <div className="text-center space-y-4">
                      <div className="mx-auto w-24 h-24 bg-gradient-accent rounded-full flex items-center justify-center">
                        <Shield className={`h-12 w-12 text-accent-foreground ${isRecording ? 'animate-pulse' : ''}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Verify Your Voice</h3>
                        <p className="text-sm text-muted-foreground mt-2">
                          Please say your passphrase again to complete authentication
                        </p>
                      </div>
                      <Button
                        onClick={verifyVoice}
                        disabled={isRecording}
                        className="w-full min-h-touch"
                      >
                        {isRecording ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Verifying...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Verify Voice
                          </div>
                        )}
                      </Button>
                    </div>
                  )}

                  {voiceSetupStep === 'complete' && (
                    <div className="text-center space-y-4">
                      <div className="mx-auto w-24 h-24 bg-gradient-accent rounded-full flex items-center justify-center">
                        <CheckCircle className="h-12 w-12 text-accent-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Authentication Complete</h3>
                        <p className="text-sm text-muted-foreground mt-2">
                          Your voice has been verified successfully
                        </p>
                      </div>
                      <Button
                        onClick={handleVoiceLogin}
                        disabled={isLoading}
                        className="w-full min-h-touch"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Signing in...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Complete Sign In
                          </div>
                        )}
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Demo Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Alert>
            <Eye className="h-4 w-4" />
            <AlertDescription>
              <strong>Demo Mode:</strong> This is a demonstration of accessible crypto wallet authentication. 
              Voice authentication is simulated for demo purposes.
            </AlertDescription>
          </Alert>
        </motion.div>
      </motion.div>
    </div>
  );
};