import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { FiatOnOffRamp } from '../components/FiatOnOffRamp';
import { useFiat } from '../contexts/FiatContext';
import { useAccessibility } from '../contexts/AccessibilityContext';

export const FiatPage: React.FC = () => {
  const { fiatTransactions, exchangeRates } = useFiat();
  const { settings, announceToScreenReader } = useAccessibility();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-warning animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'processing':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  React.useEffect(() => {
    announceToScreenReader('Fiat on/off ramp page loaded. Convert between Nigerian Naira and stablecoins.');
  }, [announceToScreenReader]);

  return (
    <motion.div
      className="container mx-auto px-4 py-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: settings.reducedMotion ? 0 : 0.3 }}
    >
      {/* Page Header */}
      <motion.div 
        className="text-center space-y-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: settings.reducedMotion ? 0 : 0.3, delay: 0.1 }}
      >
        <h1 className="text-3xl font-bold text-foreground">
          Fiat Gateway
        </h1>
        <p className="text-muted-foreground text-lg">
          Buy and sell crypto with Nigerian Naira (NGN)
        </p>
      </motion.div>

      {/* Exchange Rates Overview */}
      <motion.div
        className="grid md:grid-cols-2 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: settings.reducedMotion ? 0 : 0.3, delay: 0.2 }}
      >
        {exchangeRates.map((rate, index) => (
          <Card key={rate.currency} className="bg-gradient-subtle">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{rate.currency}/NGN</h3>
                  <div className="space-y-1 mt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Buy:</span>
                      <span className="font-bold text-success">₦{rate.buyRate.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Sell:</span>
                      <span className="font-bold text-destructive">₦{rate.sellRate.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Live
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-2">
                    Updated: {rate.lastUpdated.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Fiat On/Off Ramp Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: settings.reducedMotion ? 0 : 0.3, delay: 0.3 }}
      >
        <FiatOnOffRamp />
      </motion.div>

      {/* Recent Fiat Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: settings.reducedMotion ? 0 : 0.3, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpDown className="h-5 w-5" />
              Recent Fiat Transactions
            </CardTitle>
            <CardDescription>
              Your recent buy and sell transactions with NGN
            </CardDescription>
          </CardHeader>
          <CardContent>
            {fiatTransactions.length > 0 ? (
              <div className="space-y-4">
                {fiatTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: settings.reducedMotion ? 0 : 0.2, 
                      delay: settings.reducedMotion ? 0 : index * 0.1 
                    }}
                    className="p-4 border rounded-lg hover:shadow-medium transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          transaction.type === 'buy' 
                            ? 'bg-success/10 text-success' 
                            : 'bg-destructive/10 text-destructive'
                        }`}>
                          {transaction.type === 'buy' ? '↓' : '↑'}
                        </div>
                        <div>
                          <div className="font-semibold capitalize">
                            {transaction.type} {transaction.cryptoCurrency}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {transaction.timestamp.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={getStatusBadgeVariant(transaction.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(transaction.status)}
                              <span className="capitalize">{transaction.status}</span>
                            </div>
                          </Badge>
                        </div>
                        <div className="font-bold">
                          {transaction.type === 'buy' ? '+' : '-'}
                          {transaction.cryptoAmount.toFixed(4)} {transaction.cryptoCurrency}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ₦{transaction.fiatAmount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <ArrowUpDown className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No fiat transactions yet</p>
                <p className="text-sm mt-1">Your buy/sell history will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};