import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Mic, DollarSign, Heart } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const features = [
    {
      icon: <Mic className="h-6 w-6" />,
      title: "Voice-First Navigation",
      description: "Control your wallet with simple voice commands"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure Login",
      description: "Smart contract-based authentication with biometric support"
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Accessible DeFi",
      description: "Trade, stake, and manage crypto with inclusive design"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Built for Everyone",
      description: "WCAG 2.1 compliant for users with disabilities"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Main Branding */}
      <div className="space-y-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <h1 className="text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            INKLUZIV
          </h1>
        </motion.div>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-2xl lg:text-3xl text-muted-foreground font-light"
        >
          Accessible DeFi for Everyone
        </motion.p>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-lg text-muted-foreground max-w-lg"
        >
          The world's first crypto wallet designed with accessibility at its core. 
          Experience DeFi through voice commands, screen readers, and inclusive design.
        </motion.p>
      </div>

      {/* Features List */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-semibold text-foreground">
          Why Choose INKLUZIV?
        </h2>
        
        <div className="grid gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
              className="flex items-start space-x-4 p-4 rounded-lg bg-card hover:bg-accent/50 transition-colors duration-200"
            >
              <div className="flex-shrink-0 p-2 bg-primary/10 rounded-md text-primary">
                {feature.icon}
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};