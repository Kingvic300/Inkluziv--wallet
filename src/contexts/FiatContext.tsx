import React, { createContext, useContext, useState } from 'react';

export interface FiatTransaction {
  id: string;
  type: 'buy' | 'sell';
  fiatAmount: number;
  cryptoAmount: number;
  fiatCurrency: 'NGN';
  cryptoCurrency: 'USDT' | 'USDC';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  timestamp: Date;
  exchangeRate: number;
  fees: number;
  paymentMethod: 'bank_transfer' | 'card' | 'mobile_money';
}

export interface ExchangeRate {
  currency: 'USDT' | 'USDC';
  buyRate: number; // NGN per crypto
  sellRate: number; // NGN per crypto
  lastUpdated: Date;
}

interface FiatContextType {
  fiatTransactions: FiatTransaction[];
  exchangeRates: ExchangeRate[];
  isProcessing: boolean;
  buyWithFiat: (amount: number, currency: 'USDT' | 'USDC', paymentMethod: string) => Promise<void>;
  sellForFiat: (amount: number, currency: 'USDT' | 'USDC', paymentMethod: string) => Promise<void>;
  getExchangeRate: (currency: 'USDT' | 'USDC', type: 'buy' | 'sell') => number;
}

const FiatContext = createContext<FiatContextType | undefined>(undefined);

export const FiatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Mock exchange rates (NGN per crypto)
  const [exchangeRates] = useState<ExchangeRate[]>([
    {
      currency: 'USDT',
      buyRate: 1650, // Buy USDT at 1650 NGN
      sellRate: 1620, // Sell USDT at 1620 NGN
      lastUpdated: new Date(),
    },
    {
      currency: 'USDC',
      buyRate: 1648,
      sellRate: 1618,
      lastUpdated: new Date(),
    },
  ]);

  const [fiatTransactions, setFiatTransactions] = useState<FiatTransaction[]>([
    {
      id: 'fiat-1',
      type: 'buy',
      fiatAmount: 50000,
      cryptoAmount: 30.3,
      fiatCurrency: 'NGN',
      cryptoCurrency: 'USDT',
      status: 'completed',
      timestamp: new Date(Date.now() - 86400000),
      exchangeRate: 1650,
      fees: 500,
      paymentMethod: 'bank_transfer',
    },
    {
      id: 'fiat-2',
      type: 'sell',
      fiatAmount: 32400,
      cryptoAmount: 20,
      fiatCurrency: 'NGN',
      cryptoCurrency: 'USDC',
      status: 'processing',
      timestamp: new Date(Date.now() - 3600000),
      exchangeRate: 1620,
      fees: 324,
      paymentMethod: 'bank_transfer',
    },
  ]);

  const buyWithFiat = async (fiatAmount: number, currency: 'USDT' | 'USDC', paymentMethod: string) => {
    setIsProcessing(true);
    
    const rate = getExchangeRate(currency, 'buy');
    const fees = fiatAmount * 0.01; // 1% fee
    const cryptoAmount = (fiatAmount - fees) / rate;
    
    // Mock processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const newTransaction: FiatTransaction = {
      id: `fiat-${Date.now()}`,
      type: 'buy',
      fiatAmount,
      cryptoAmount,
      fiatCurrency: 'NGN',
      cryptoCurrency: currency,
      status: 'processing',
      timestamp: new Date(),
      exchangeRate: rate,
      fees,
      paymentMethod: paymentMethod as any,
    };
    
    setFiatTransactions(prev => [newTransaction, ...prev]);
    setIsProcessing(false);
  };

  const sellForFiat = async (cryptoAmount: number, currency: 'USDT' | 'USDC', paymentMethod: string) => {
    setIsProcessing(true);
    
    const rate = getExchangeRate(currency, 'sell');
    const fiatAmount = cryptoAmount * rate;
    const fees = fiatAmount * 0.01; // 1% fee
    
    // Mock processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const newTransaction: FiatTransaction = {
      id: `fiat-${Date.now()}`,
      type: 'sell',
      fiatAmount: fiatAmount - fees,
      cryptoAmount,
      fiatCurrency: 'NGN',
      cryptoCurrency: currency,
      status: 'processing',
      timestamp: new Date(),
      exchangeRate: rate,
      fees,
      paymentMethod: paymentMethod as any,
    };
    
    setFiatTransactions(prev => [newTransaction, ...prev]);
    setIsProcessing(false);
  };

  const getExchangeRate = (currency: 'USDT' | 'USDC', type: 'buy' | 'sell'): number => {
    const rate = exchangeRates.find(r => r.currency === currency);
    return rate ? (type === 'buy' ? rate.buyRate : rate.sellRate) : 0;
  };

  return (
    <FiatContext.Provider value={{
      fiatTransactions,
      exchangeRates,
      isProcessing,
      buyWithFiat,
      sellForFiat,
      getExchangeRate,
    }}>
      {children}
    </FiatContext.Provider>
  );
};

export const useFiat = () => {
  const context = useContext(FiatContext);
  if (context === undefined) {
    throw new Error('useFiat must be used within a FiatProvider');
  }
  return context;
};