import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from '@/components/LoginForm';
import { SignupForm } from '@/components/SignupForm';

export const AuthTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-lg border-border/50">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Welcome to Inkluziv
            </CardTitle>
            <CardDescription className="text-center">
              Your accessible gateway to DeFi
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger 
                  value="login"
                  className="text-sm font-medium"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="text-sm font-medium"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
              
              <motion.div
                key={activeTab}
                initial={{ x: activeTab === "login" ? -20 : 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="login" className="mt-6 space-y-4">
                  <LoginForm />
                </TabsContent>
                
                <TabsContent value="signup" className="mt-6 space-y-4">
                  <SignupForm />
                </TabsContent>
              </motion.div>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};