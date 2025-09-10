import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AccessibleInput } from '@/components/AccessibleInput';
import { VoiceCommand } from '@/components/VoiceCommand';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mic, Eye, EyeOff, Check, X } from 'lucide-react';

export const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth(); // auto-login after signup
  const { toast } = useToast();

  const passwordStrength = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
  };

  const passwordsMatch =
      formData.password === formData.confirmPassword &&
      formData.confirmPassword !== '';

  const isFormValid =
      Object.values(passwordStrength).every(Boolean) &&
      passwordsMatch &&
      formData.username &&
      formData.email;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSignup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!isFormValid) {
      toast({
        title: 'Form Incomplete',
        description: 'Please fill in all fields and ensure passwords match',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    // Simulate API/signup success
    setTimeout(() => {
      login(formData.email, formData.password);
      toast({
        title: 'Welcome to Inkluziv!',
        description: 'Your account has been created successfully'
      });
      setIsLoading(false);
    }, 2000);
  };

  const handleVoiceSignup = () => {
    handleSignup();
  };

  const handleVoiceCommand = (command: string) => {
    if (command.toLowerCase().includes('signup') || command.toLowerCase().includes('sign up')) {
      handleVoiceSignup();
    }
  };

  return (
      <motion.form
          onSubmit={handleSignup}
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
      >
        <div className="space-y-4">
          <AccessibleInput
              type="text"
              label="Username"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              placeholder="Choose a username"
              required
              autoComplete="username"
              disabled={isLoading}
          />

          <AccessibleInput
              type="email"
              label="Email Address"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email"
              required
              autoComplete="email"
              disabled={isLoading}
          />

          {/* Password input with toggle */}
          <div className="relative">
            <AccessibleInput
                type={showPassword ? 'text' : 'password'}
                label="Password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Create a strong password"
                required
                autoComplete="new-password"
                disabled={isLoading}
            />
            <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-8 h-8 w-8 p-0"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>

          {/* Password requirements */}
          {formData.password && (
              <div className="space-y-2 text-sm">
                <p className="font-medium text-foreground">Password Requirements:</p>
                <div className="grid grid-cols-2 gap-1">
                  {[
                    { key: 'length', label: '8+ characters' },
                    { key: 'uppercase', label: 'Uppercase letter' },
                    { key: 'lowercase', label: 'Lowercase letter' },
                    { key: 'number', label: 'Number' }
                  ].map((req) => (
                      <div key={req.key} className="flex items-center space-x-1">
                        {passwordStrength[req.key as keyof typeof passwordStrength] ? (
                            <Check className="h-3 w-3 text-green-500" />
                        ) : (
                            <X className="h-3 w-3 text-red-500" />
                        )}
                        <span
                            className={
                              passwordStrength[req.key as keyof typeof passwordStrength]
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-muted-foreground'
                            }
                        >
                    {req.label}
                  </span>
                      </div>
                  ))}
                </div>
              </div>
          )}

          {/* Confirm Password input */}
          <div className="relative">
            <AccessibleInput
                type={showConfirmPassword ? 'text' : 'password'}
                label="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Confirm your password"
                required
                autoComplete="new-password"
                disabled={isLoading}
            />
            <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-8 h-8 w-8 p-0"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide password confirmation' : 'Show password confirmation'}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>

          {formData.confirmPassword && (
              <div className="flex items-center space-x-2 text-sm">
                {passwordsMatch ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-green-600 dark:text-green-400">Passwords match</span>
                    </>
                ) : (
                    <>
                      <X className="h-4 w-4 text-red-500" />
                      <span className="text-red-600 dark:text-red-400">Passwords don’t match</span>
                    </>
                )}
              </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
              type="submit"
              className="w-full"
              disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
            ) : (
                'Create Account'
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
                type="button"
                variant="outline"
                onClick={handleVoiceSignup}
                disabled={!isFormValid || isLoading}
                className="w-full"
            >
              <Mic className="mr-2 h-4 w-4" />
              Voice Signup
            </Button>

            <VoiceCommand
                onCommand={handleVoiceCommand}
                commands={['signup', 'sign up']}
                triggerButton={
                  <Button
                      type="button"
                      variant="outline"
                      disabled={!isFormValid || isLoading}
                      className="w-full"
                  >
                    <Mic className="mr-2 h-4 w-4" />
                    Say "Signup"
                  </Button>
                }
            />
          </div>
        </div>
      </motion.form>
  );
};
