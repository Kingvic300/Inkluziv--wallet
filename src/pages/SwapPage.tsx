import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown, RefreshCw, Info, Zap, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { AccessibleInput } from '../components/AccessibleInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useWallet } from '../contexts/WalletContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useToast } from '../hooks/use-toast';

export const SwapPage: React.FC = () => {
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('USDC');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(1650); // Mock ETH to USDC rate
  const [slippage, setSlippage] = useState('0.5');

  const { balances, addTransaction } = useWallet();
  const { settings, announceToScreenReader } = useAccessibility();
  const { toast } = useToast();

  // Mock exchange rates
  const mockRates: { [key: string]: { [key: string]: number } } = {
    ETH: { USDC: 1650, BTC: 0.025, MATIC: 1845 },
    USDC: { ETH: 0.0006, BTC: 0.000015, MATIC: 1.12 },
    BTC: { ETH: 40, USDC: 66000, MATIC: 73800 },
    MATIC: { ETH: 0.00054, USDC: 0.89, BTC: 0.0000135 }
  };

  const availableTokens = balances.map(b => b.symbol);

  useEffect(() => {
    if (fromToken && toToken && mockRates[fromToken]?.[toToken]) {
      setExchangeRate(mockRates[fromToken][toToken]);
    }
  }, [fromToken, toToken]);

  useEffect(() => {
    if (fromAmount && !isNaN(parseFloat(fromAmount))) {
      const calculated = (parseFloat(fromAmount) * exchangeRate).toFixed(6);
      setToAmount(calculated);
    } else {
      setToAmount('');
    }
  }, [fromAmount, exchangeRate]);

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    const tempAmount = fromAmount;
    
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    
    announceToScreenReader(`Swapped token positions. Now swapping ${toToken} to ${tempToken}`);
  };

  const handleSwap = async () => {
    if (!fromAmount || !toAmount) return;

    setIsSwapping(true);
    announceToScreenReader('Processing token swap transaction');

    // Mock swap processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    addTransaction({
      type: 'swap',
      amount: parseFloat(fromAmount),
      token: fromToken,
      status: 'pending',
    });

    toast({
      title: 'Swap Initiated',
      description: `Swapping ${fromAmount} ${fromToken} to ${toAmount} ${toToken}`,
    });

    setIsSwapping(false);
    setFromAmount('');
    setToAmount('');
  };

  const getFromBalance = () => {
    return balances.find(b => b.symbol === fromToken)?.balance || 0;
  };

  const getEstimatedGasFee = () => {
    // Mock gas fee calculation
    return (0.005 * exchangeRate).toFixed(4);
  };

  const getPriceImpact = (): string => {
    // Mock price impact calculation
    if (!fromAmount) return '0';
    const amount = parseFloat(fromAmount);
    return amount > 10 ? (amount * 0.1).toFixed(2) : '0.05';
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-6 space-y-6 max-w-2xl"
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
          Token Swap
        </h1>
        <p className="text-muted-foreground">
          Exchange one token for another at the current market rate
        </p>
      </motion.div>

      {/* Swap Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: settings.reducedMotion ? 0 : 0.3, delay: 0.2 }}
      >
        <Card className="relative">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpDown className="h-5 w-5" />
              Swap Tokens
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* From Token */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                From
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <AccessibleInput
                    label=""
                    placeholder="0.0"
                    type="number"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    voiceInputEnabled
                    onVoiceInput={setFromAmount}
                    className="text-xl h-14"
                  />
                </div>
                <Select value={fromToken} onValueChange={setFromToken}>
                  <SelectTrigger className="h-14">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border shadow-medium">
                    {availableTokens.filter(token => token !== toToken).map((token) => (
                      <SelectItem key={token} value={token}>
                        {token}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Balance: {getFromBalance().toFixed(4)} {fromToken}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFromAmount(getFromBalance().toString())}
                  className="h-auto p-0 text-xs text-primary hover:text-primary"
                >
                  Max
                </Button>
              </div>
            </div>

            {/* Swap Arrow */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSwapTokens}
                className="rounded-full w-10 h-10 p-0 border-2"
                aria-label="Swap token positions"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>

            {/* To Token */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                To
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <AccessibleInput
                    label=""
                    placeholder="0.0"
                    value={toAmount}
                    readOnly
                    className="text-xl h-14 bg-muted"
                  />
                </div>
                <Select value={toToken} onValueChange={setToToken}>
                  <SelectTrigger className="h-14">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border shadow-medium">
                    {availableTokens.filter(token => token !== fromToken).map((token) => (
                      <SelectItem key={token} value={token}>
                        {token}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-muted-foreground">
                Balance: {(balances.find(b => b.symbol === toToken)?.balance || 0).toFixed(4)} {toToken}
              </div>
            </div>

            {/* Swap Details */}
            {fromAmount && toAmount && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: settings.reducedMotion ? 0 : 0.3 }}
                className="space-y-3 p-4 bg-muted rounded-lg"
              >
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Exchange Rate</span>
                  <span className="font-medium">
                    1 {fromToken} = {exchangeRate.toLocaleString()} {toToken}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price Impact</span>
                  <span className={`font-medium ${parseFloat(getPriceImpact()) > 3 ? 'text-warning' : 'text-success'}`}>
                    {getPriceImpact()}%
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estimated Gas Fee</span>
                  <span className="font-medium">${getEstimatedGasFee()}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Slippage Tolerance</span>
                  <div className="flex items-center gap-2">
                    <Select value={slippage} onValueChange={setSlippage}>
                      <SelectTrigger className="w-20 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.1">0.1%</SelectItem>
                        <SelectItem value="0.5">0.5%</SelectItem>
                        <SelectItem value="1.0">1.0%</SelectItem>
                        <SelectItem value="3.0">3.0%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Price Impact Warning */}
            {parseFloat(getPriceImpact()) > 3 && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  High price impact detected ({getPriceImpact()}%). Consider reducing your swap amount.
                </AlertDescription>
              </Alert>
            )}

            {/* Swap Button */}
            <Button
              onClick={handleSwap}
              disabled={!fromAmount || !toAmount || isSwapping || parseFloat(fromAmount) > getFromBalance()}
              className="w-full min-h-touch text-lg"
              size="lg"
            >
              {isSwapping ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  Swapping...
                </div>
              ) : parseFloat(fromAmount) > getFromBalance() ? (
                'Insufficient Balance'
              ) : !fromAmount || !toAmount ? (
                'Enter Amount'
              ) : (
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Swap Tokens
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Market Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: settings.reducedMotion ? 0 : 0.3, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Market Information</CardTitle>
            <CardDescription>
              Current exchange rates and market data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(mockRates).slice(0, 4).map(([from, rates]) => (
                <div key={from} className="text-center p-3 bg-muted rounded-lg">
                  <div className="font-semibold text-sm">{from}/USDC</div>
                  <div className="text-lg font-bold text-foreground">
                    {rates.USDC?.toLocaleString() || 'N/A'}
                  </div>
                  <Badge variant="secondary" className="text-xs mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +2.3%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};