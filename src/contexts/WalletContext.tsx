import React, { createContext, useContext, useState } from 'react';

export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'swap' | 'stake' | 'unstake';
  amount: number;
  token: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: Date;
  from?: string;
  to?: string;
  hash?: string;
}

export interface TokenBalance {
  symbol: string;
  balance: number;
  usdValue: number;
  icon?: string;
}

export interface StakingPool {
  id: string;
  name: string;
  token: string;
  apy: number;
  totalStaked: number;
  userStaked: number;
  rewards: number;
}

interface WalletContextType {
  balances: TokenBalance[];
  transactions: Transaction[];
  stakingPools: StakingPool[];
  isConnected: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;
  updateBalance: (symbol: string, newBalance: number) => void;
  stakeTokens: (poolId: string, amount: number) => void;
  unstakeTokens: (poolId: string, amount: number) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected] = useState(true); // Mock connected state

  const [balances, setBalances] = useState<TokenBalance[]>([
    { symbol: 'ETH', balance: 0.25, usdValue: 12.55 },
    { symbol: 'USDC', balance: 120.75, usdValue: 20.75 },
    { symbol: 'BTC', balance: 0.005, usdValue: 84.73 },
    { symbol: 'MATIC', balance: 10.0, usdValue: 8.95 },
  ]);


  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'receive',
      amount: 0.5,
      token: 'ETH',
      status: 'confirmed',
      timestamp: new Date(Date.now() - 86400000),
      from: '0x742d35Cc6558Fb8c2D7ab2b5b0F5C8061bb6C87d',
    },
    {
      id: '2',
      type: 'send',
      amount: 100,
      token: 'USDC',
      status: 'confirmed',
      timestamp: new Date(Date.now() - 172800000),
      to: '0x8ba1f109551bD432803012645Hac136c30493c4',
    },
    {
      id: '3',
      type: 'swap',
      amount: 0.1,
      token: 'ETH',
      status: 'pending',
      timestamp: new Date(Date.now() - 3600000),
    },
  ]);

  const [stakingPools, setStakingPools] = useState<StakingPool[]>([
    {
      id: 'eth-staking',
      name: 'Ethereum 2.0 Staking',
      token: 'ETH',
      apy: 4.2,
      totalStaked: 15000000,
      userStaked: 1.5,
      rewards: 0.025,
    },
    {
      id: 'usdc-lending',
      name: 'USDC Lending Pool',
      token: 'USDC',
      apy: 8.5,
      totalStaked: 50000000,
      userStaked: 500,
      rewards: 12.75,
    },
    {
      id: 'matic-staking',
      name: 'Polygon Staking',
      token: 'MATIC',
      apy: 12.1,
      totalStaked: 2000000,
      userStaked: 50,
      rewards: 2.8,
    },
  ]);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const updateBalance = (symbol: string, newBalance: number) => {
    setBalances(prev => 
      prev.map(balance => 
        balance.symbol === symbol 
          ? { ...balance, balance: newBalance }
          : balance
      )
    );
  };

  const stakeTokens = (poolId: string, amount: number) => {
    setStakingPools(prev =>
      prev.map(pool =>
        pool.id === poolId
          ? { ...pool, userStaked: pool.userStaked + amount }
          : pool
      )
    );
    
    addTransaction({
      type: 'stake',
      amount,
      token: stakingPools.find(p => p.id === poolId)?.token || 'ETH',
      status: 'pending',
    });
  };

  const unstakeTokens = (poolId: string, amount: number) => {
    setStakingPools(prev =>
      prev.map(pool =>
        pool.id === poolId
          ? { ...pool, userStaked: Math.max(0, pool.userStaked - amount) }
          : pool
      )
    );
    
    addTransaction({
      type: 'unstake',
      amount,
      token: stakingPools.find(p => p.id === poolId)?.token || 'ETH',
      status: 'pending',
    });
  };

  return (
    <WalletContext.Provider value={{
      balances,
      transactions,
      stakingPools,
      isConnected,
      addTransaction,
      updateBalance,
      stakeTokens,
      unstakeTokens,
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};