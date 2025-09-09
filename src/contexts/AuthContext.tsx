import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  voiceBiometricEnabled: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  loginWithVoice: () => Promise<void>;
  logout: () => void;
  setupVoiceBiometric: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: '1',
    name: 'Ayodeji Akinwumi',
    email: 'ayodeji09@gmail.com',
    voiceBiometricEnabled: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const isAuthenticated = !!user;

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    // Mock login process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setUser({
      id: '1',
      name: 'Ayodeji Akinwumi',
      email,
      voiceBiometricEnabled: true,
    });
    setIsLoading(false);
  };

  const loginWithVoice = async () => {
    setIsLoading(true);
    // Mock voice biometric login
    await new Promise(resolve => setTimeout(resolve, 3000));
    setUser({
      id: '1',
      name: 'Ayodeji Akinwumi',
      email: 'ayodeji09@gmail.com',
      voiceBiometricEnabled: true,
    });
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    navigate('/');
  };

  const setupVoiceBiometric = async () => {
    setIsLoading(true);
    // Mock voice biometric setup
    await new Promise(resolve => setTimeout(resolve, 5000));
    if (user) {
      setUser({ ...user, voiceBiometricEnabled: true });
    }
    setIsLoading(false);
  };

  return (
      <AuthContext.Provider value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        loginWithVoice,
        logout,
        setupVoiceBiometric,
      }}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};