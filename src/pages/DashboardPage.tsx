import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft,
  Coins,
  Banknote,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { TransactionCard } from '../components/TransactionCard';
import { useWallet } from '../contexts/WalletContext';
import { useAccessibility } from '../contexts/AccessibilityContext';

export const DashboardPage: React.FC = () => {
  const { balances, transactions, stakingPools } = useWallet();
  const { settings, announceToScreenReader } = useAccessibility();

  const totalPortfolioValue = balances.reduce((sum, balance) => sum + balance.usdValue, 0);
  const recentTransactions = transactions.slice(0, 3);
  const totalStaked = stakingPools.reduce((sum, pool) => sum + pool.userStaked, 0);
  const totalRewards = stakingPools.reduce((sum, pool) => sum + pool.rewards, 0);

  const quickActions = [
    {
      icon: Plus,
      label: 'Send',
      description: 'Send tokens to another address',
      href: '/wallet?action=send',
      color: 'bg-destructive/10 text-destructive'
    },
    {
      icon: ArrowDownLeft,
      label: 'Receive',
      description: 'Receive tokens to your wallet',
      href: '/wallet?action=receive',
      color: 'bg-success/10 text-success'
    },
    {
      icon: Banknote,
      label: 'Buy/Sell',
      description: 'Trade with Nigerian Naira',
      href: '/fiat',
      color: 'bg-warning/10 text-warning'
    },
    {
      icon: ArrowUpRight,
      label: 'Swap',
      description: 'Exchange one token for another',
      href: '/swap',
      color: 'bg-primary/10 text-primary'
    },
  ];

  React.useEffect(() => {
    announceToScreenReader(`Dashboard loaded. Portfolio value: $${totalPortfolioValue.toLocaleString()}`);
  }, [totalPortfolioValue, announceToScreenReader]);

  return (
    <motion.div
      className="container mx-auto px-4 py-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: settings.reducedMotion ? 0 : 0.3 }}
    >
      {/* Page Header */}
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: settings.reducedMotion ? 0 : 0.3, delay: 0.1 }}
      >
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back!
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your crypto portfolio and recent activity.
        </p>
      </motion.div>

      {/* Portfolio Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: settings.reducedMotion ? 0 : 0.3, delay: 0.2 }}
      >
        <Card className="bg-gradient-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Wallet className="h-6 w-6" />
              Total Portfolio Value
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Combined value of all your assets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-4">
              ${totalPortfolioValue.toLocaleString('en-US', { 
                minimumFractionDigits: 2,
                maximumFractionDigits: 2 
              })}
            </div>
            <div className="flex items-center gap-2 text-sm text-primary-foreground/90">
              <TrendingUp className="h-4 w-4" />
              <span>+5.2% from last week</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: settings.reducedMotion ? 0 : 0.3, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common wallet operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: settings.reducedMotion ? 0 : 0.2, 
                    delay: settings.reducedMotion ? 0 : 0.4 + index * 0.1 
                  }}
                >
                  <Button
                    asChild
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-3 hover:shadow-medium transition-all"
                  >
                    <Link 
                      to={action.href}
                      aria-label={`${action.label}: ${action.description}`}
                    >
                      <div className={`p-3 rounded-full ${action.color}`}>
                        <action.icon className="h-6 w-6" />
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{action.label}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {action.description}
                        </div>
                      </div>
                    </Link>
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Portfolio Breakdown & Staking Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Asset Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: settings.reducedMotion ? 0 : 0.3, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Asset Breakdown</CardTitle>
              <CardDescription>
                Your token holdings by value
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {balances.map((balance, index) => {
                const percentage = (balance.usdValue / totalPortfolioValue) * 100;
                return (
                  <div key={balance.symbol} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{balance.symbol}</span>
                      <span className="text-muted-foreground">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{balance.balance} {balance.symbol}</span>
                      <span>${balance.usdValue.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Staking Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: settings.reducedMotion ? 0 : 0.3, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5" />
                Staking Summary
              </CardTitle>
              <CardDescription>
                Your staking positions and rewards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-foreground">
                    {totalStaked.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Staked
                  </div>
                </div>
                <div className="text-center p-3 bg-success/10 rounded-lg">
                  <div className="text-2xl font-bold text-success">
                    {totalRewards.toFixed(3)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Rewards Earned
                  </div>
                </div>
              </div>
              <Button asChild className="w-full">
                <Link to="/staking">
                  Manage Staking Positions
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: settings.reducedMotion ? 0 : 0.3, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  Your latest wallet activity
                </CardDescription>
              </div>
              <Button asChild variant="outline">
                <Link to="/transactions">
                  View All
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentTransactions.length > 0 ? (
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <TransactionCard 
                    key={transaction.id} 
                    transaction={transaction} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No recent transactions</p>
                <p className="text-sm mt-1">Your transaction history will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};