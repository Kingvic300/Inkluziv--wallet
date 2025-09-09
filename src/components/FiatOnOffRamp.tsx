import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Banknote, 
  ArrowUpDown, 
  Info, 
  CheckCircle,
  Clock,
  AlertCircle,
  Smartphone
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AccessibleInput } from './AccessibleInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { useFiat } from '../contexts/FiatContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useToast } from '../hooks/use-toast';
import { cn } from '../lib/utils';

interface FiatOnOffRampProps {
  onClose?: () => void;
}

export const FiatOnOffRamp: React.FC<FiatOnOffRampProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [fiatAmount, setFiatAmount] = useState('');
  const [cryptoAmount, setCryptoAmount] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState<'USDT' | 'USDC'>('USDT');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  
  const { buyWithFiat, sellForFiat, getExchangeRate, isProcessing } = useFiat();
  const { settings, announceToScreenReader } = useAccessibility();
  const { toast } = useToast();

  const exchangeRate = getExchangeRate(selectedCrypto, activeTab);
  const fees = parseFloat(fiatAmount) * 0.01 || 0;

  React.useEffect(() => {
    if (fiatAmount && !isNaN(parseFloat(fiatAmount))) {
      if (activeTab === 'buy') {
        const crypto = (parseFloat(fiatAmount) - fees) / exchangeRate;
        setCryptoAmount(crypto.toFixed(6));
      } else {
        const fiat = parseFloat(fiatAmount) * exchangeRate - fees;
        setCryptoAmount((parseFloat(fiatAmount) / exchangeRate).toFixed(6));
      }
    } else {
      setCryptoAmount('');
    }
  }, [fiatAmount, exchangeRate, activeTab, fees]);

  const handleTransaction = async () => {
    if (!fiatAmount) return;

    try {
      if (activeTab === 'buy') {
        await buyWithFiat(parseFloat(fiatAmount), selectedCrypto, paymentMethod);
        toast({
          title: 'Purchase Initiated',
          description: `Buying ${cryptoAmount} ${selectedCrypto} with ₦${fiatAmount}`,
        });
      } else {
        await sellForFiat(parseFloat(cryptoAmount), selectedCrypto, paymentMethod);
        toast({
          title: 'Sale Initiated',
          description: `Selling ${cryptoAmount} ${selectedCrypto} for ₦${fiatAmount}`,
        });
      }
      
      setFiatAmount('');
      setCryptoAmount('');
      announceToScreenReader(`${activeTab === 'buy' ? 'Purchase' : 'Sale'} transaction initiated successfully`);
    } catch (error) {
      toast({
        title: 'Transaction Failed',
        description: 'Please try again or contact support',
        variant: 'destructive',
      });
    }
  };

  const paymentMethods = [
    { value: 'bank_transfer', label: 'Bank Transfer', icon: Banknote, description: 'Direct bank transfer (2-5 mins)' },
    { value: 'card', label: 'Debit Card', icon: CreditCard, description: 'Instant payment with card' },
    { value: 'mobile_money', label: 'Mobile Money', icon: Smartphone, description: 'Pay with mobile wallet' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: settings.reducedMotion ? 0 : 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="border-primary/20 shadow-strong">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <ArrowUpDown className="h-6 w-6 text-primary" />
                Fiat On/Off Ramp
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Buy and sell crypto with Nigerian Naira (NGN)
              </CardDescription>
            </div>
            {onClose && (
              <Button variant="ghost" onClick={onClose} className="text-muted-foreground">
                ✕
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Tab Selection */}
          <div className="flex bg-muted p-1 rounded-lg">
            <Button
              variant={activeTab === 'buy' ? 'default' : 'ghost'}
              onClick={() => {
                setActiveTab('buy');
                announceToScreenReader('Switched to buy crypto with fiat');
              }}
              className="flex-1 min-h-touch"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Buy Crypto
            </Button>
            <Button
              variant={activeTab === 'sell' ? 'default' : 'ghost'}
              onClick={() => {
                setActiveTab('sell');
                announceToScreenReader('Switched to sell crypto for fiat');
              }}
              className="flex-1 min-h-touch"
            >
              <Banknote className="h-4 w-4 mr-2" />
              Sell Crypto
            </Button>
          </div>

          {/* Exchange Rate Display */}
          <div className="p-4 bg-gradient-subtle rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Current Rate</div>
                <div className="text-lg font-bold">
                  1 {selectedCrypto} = ₦{exchangeRate.toLocaleString()}
                </div>
              </div>
              <Badge variant="secondary" className="bg-success/10 text-success">
                Live Rate
              </Badge>
            </div>
          </div>

          {/* Amount Input */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <AccessibleInput
                label={activeTab === 'buy' ? 'Amount to Spend (NGN)' : 'Amount to Receive (NGN)'}
                placeholder="0.00"
                type="number"
                value={fiatAmount}
                onChange={(e) => setFiatAmount(e.target.value)}
                voiceInputEnabled
                onVoiceInput={setFiatAmount}
                className="text-xl h-14"
              />
              <div className="text-sm text-muted-foreground">
                Nigerian Naira (₦)
              </div>
            </div>

            <div className="space-y-3">
              <AccessibleInput
                label={activeTab === 'buy' ? 'You Will Receive' : 'Amount to Sell'}
                placeholder="0.000000"
                value={cryptoAmount}
                readOnly={activeTab === 'buy'}
                onChange={activeTab === 'sell' ? (e) => {
                  setCryptoAmount(e.target.value);
                  if (e.target.value) {
                    const fiat = parseFloat(e.target.value) * exchangeRate;
                    setFiatAmount(fiat.toFixed(2));
                  }
                } : undefined}
                className="text-xl h-14 bg-muted"
              />
              <Select value={selectedCrypto} onValueChange={(value: 'USDT' | 'USDC') => setSelectedCrypto(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USDT">USDT (Tether)</SelectItem>
                  <SelectItem value="USDC">USDC (USD Coin)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Payment Method
            </label>
            <div className="grid gap-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.value}
                  className={cn(
                    'p-4 border-2 rounded-lg cursor-pointer transition-all',
                    paymentMethod === method.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  )}
                  onClick={() => setPaymentMethod(method.value)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setPaymentMethod(method.value);
                    }
                  }}
                  aria-label={`Select ${method.label} payment method`}
                >
                  <div className="flex items-center gap-3">
                    <method.icon className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">{method.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {method.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction Summary */}
          {fiatAmount && cryptoAmount && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: settings.reducedMotion ? 0 : 0.3 }}
              className="p-4 bg-muted rounded-lg space-y-3"
            >
              <h3 className="font-medium">Transaction Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Exchange Rate</span>
                  <span>₦{exchangeRate.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Processing Fee (1%)</span>
                  <span>₦{fees.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t">
                  <span>
                    {activeTab === 'buy' ? 'You Pay' : 'You Receive'}
                  </span>
                  <span>₦{parseFloat(fiatAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>
                    {activeTab === 'buy' ? 'You Receive' : 'You Send'}
                  </span>
                  <span>{cryptoAmount} {selectedCrypto}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Important Notice */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Processing Time:</strong> Bank transfers typically take 2-5 minutes. 
              Card payments are processed instantly. You'll receive a confirmation once the transaction is complete.
            </AlertDescription>
          </Alert>

          {/* Action Button */}
          <Button
            onClick={handleTransaction}
            disabled={!fiatAmount || !cryptoAmount || isProcessing}
            className="w-full min-h-touch text-lg"
            size="lg"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 animate-spin" />
                Processing...
              </div>
            ) : !fiatAmount || !cryptoAmount ? (
              'Enter Amount'
            ) : (
              <div className="flex items-center gap-2">
                {activeTab === 'buy' ? (
                  <>
                    <CreditCard className="h-5 w-5" />
                    Buy {selectedCrypto} with ₦{parseFloat(fiatAmount).toLocaleString()}
                  </>
                ) : (
                  <>
                    <Banknote className="h-5 w-5" />
                    Sell {cryptoAmount} {selectedCrypto}
                  </>
                )}
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};