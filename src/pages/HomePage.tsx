import React from 'react';
import { motion } from 'framer-motion';
import { HeroSection } from '@/components/HeroSection';
import { AuthTabs } from '@/components/AuthTabs';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { Navigate } from 'react-router-dom';
import { Shield, Mic, Globe } from "lucide-react";

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { settings } = useAccessibility();

  // Redirect to dashboard if already logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Apply dark mode class to body for homepage
  React.useEffect(() => {
    if (settings.theme === 'dark' || settings.theme === 'high-contrast') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }

    return () => {
      document.body.classList.remove('dark');
    };
  }, [settings.theme]);

  return (
      <div className="min-h-screen bg-background dark flex flex-col">
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="container mx-auto px-4 py-8 flex-1"
        >
          <div className="absolute top-8 right-8 z-10">
            <DarkModeToggle />
          </div>

          {/* Hero + Auth */}
          <div className="grid lg:grid-cols-2 gap-8 min-h-screen items-center">
            <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="flex flex-col items-center lg:items-start space-y-6"
            >
              <HeroSection />

              {/* Intro Text */}
              <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.7 }}
                  className="text-lg text-muted-foreground text-center lg:text-left max-w-lg"
              >
                Welcome to <span className="font-semibold text-primary">Inkluziv</span>, the voice-enabled crypto wallet designed
                for <span className="font-semibold">everyone</span>.
                Manage your digital assets with confidence, whether you prefer
                touch, voice, or assistive technologies.
              </motion.p>

              <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.7 }}
                  className="text-base text-muted-foreground text-center lg:text-left max-w-lg"
              >
                🔒 Secure • 🎙 Voice-Accessible • 🌍 Inclusive
              </motion.p>
            </motion.div>

            <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
            >
              <AuthTabs />
            </motion.div>
          </div>

          {/* Features Section */}
          <section className="py-16">
            <h2 className="text-2xl font-bold text-center mb-12">Why Choose Inkluziv?</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-6 rounded-2xl shadow-md bg-card"
              >
                <Mic className="w-10 h-10 mx-auto text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Voice Commands</h3>
                <p className="text-muted-foreground">Control your wallet with natural voice commands, making it easier for visually impaired users.</p>
              </motion.div>

              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-6 rounded-2xl shadow-md bg-card"
              >
                <Shield className="w-10 h-10 mx-auto text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Bank-Level Security</h3>
                <p className="text-muted-foreground">Your funds and data are protected with encryption, biometrics, and multi-factor authentication.</p>
              </motion.div>

              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="p-6 rounded-2xl shadow-md bg-card"
              >
                <Globe className="w-10 h-10 mx-auto text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Truly Inclusive</h3>
                <p className="text-muted-foreground">Built with accessibility at its core so everyone, everywhere can manage their crypto with ease.</p>
              </motion.div>
            </div>
          </section>

          {/* How It Works */}
          <section className="py-16 border-t">
            <h2 className="text-2xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <span className="text-3xl font-bold text-primary">1</span>
                <p className="mt-4 text-muted-foreground">Sign up and personalize your accessibility settings.</p>
              </div>
              <div className="p-6">
                <span className="text-3xl font-bold text-primary">2</span>
                <p className="mt-4 text-muted-foreground">Securely add funds and manage your crypto portfolio.</p>
              </div>
              <div className="p-6">
                <span className="text-3xl font-bold text-primary">3</span>
                <p className="mt-4 text-muted-foreground">Use voice or touch to make transactions with ease.</p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="py-16 text-center border-t">
            <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold mb-6"
            >
              Ready to experience accessible crypto?
            </motion.h2>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-muted-foreground mb-8"
            >
              Join Inkluziv today and take control of your finances your way.
            </motion.p>
            <motion.a
                href="/signup"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="inline-block px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg hover:scale-105 transition"
            >
              Get Started
            </motion.a>
          </section>

          {/* Subtitle overlay placeholder for captions */}
          <div
              className="fixed bottom-0 left-0 right-0 bg-primary/90 text-primary-foreground p-4 text-center transition-all duration-300 transform translate-y-full opacity-0"
              id="subtitle-overlay"
              role="status"
              aria-live="polite"
          >
            <p className="text-sm font-medium" id="subtitle-text">
              Accessibility captions will appear here
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="py-6 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Inkluziv. All rights reserved.
        </footer>
      </div>
  );
};

export default HomePage;
