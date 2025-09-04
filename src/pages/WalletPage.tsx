import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { 
  Send, 
  QrCode, 
  Copy, 
  Eye, 
  EyeOff,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { AccessibleInput } from '../components/AccessibleInput';
import { useWallet } from '../contexts/WalletContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useToast } from '../hooks/use-toast';
import { cn } from '../lib/utils';

export const WalletPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [sendForm, setSendForm] = useState({ recipient: '', amount: '', token: 'ETH' });
  const [showPrivateInfo, setShowPrivateInfo] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { balances, addTransaction } = useWallet();
  const { settings, announceToScreenReader } = useAccessibility();
  const { toast } = useToast();

  // Mock wallet address
  const walletAddress = '0x742d35Cc6558Fb8c2D7ab2b5b0F5C8061bb6C87d';

  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'send' || action === 'receive') {
      setActiveAction(action);
      announceToScreenReader(`${action} flow opened`);
    }
  }, [searchParams, announceToScreenReader]);

  const handleSendTransaction = async () => {
    if (!sendForm.recipient || !sendForm.amount) return;

    setIsProcessing(true);
    announceToScreenReader('Processing send transaction');

    // Mock transaction processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    addTransaction({
      type: 'send',
      amount: parseFloat(sendForm.amount),
      token: sendForm.token,
      status: 'pending',
      to: sendForm.recipient,
    });

    toast({
      title: 'Transaction Sent',
      description: `Successfully sent ${sendForm.amount} ${sendForm.token}`,
    });

    setIsProcessing(false);
    setSendForm({ recipient: '', amount: '', token: 'ETH' });
    setActiveAction(null);
    setSearchParams({});
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied!',
        description: 'Address copied to clipboard',
      });
      announceToScreenReader('Wallet address copied to clipboard');
    } catch (err) {
      toast({
        title: 'Copy failed',
        description: 'Please copy the address manually',
        variant: 'destructive',
      });
    }
  };

  const closeAction = () => {
    setActiveAction(null);
    setSearchParams({});
    announceToScreenReader('Action closed, returned to wallet overview');
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: settings.reducedMotion ? 0 : 0.3 }}
    >
      {/* Page Header */}
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: settings.reducedMotion ? 0 : 0.3, delay: 0.1 }}
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            My Wallet
          </h1>
          <p className="text-muted-foreground">
            Manage your crypto assets and transactions
          </p>
        </div>
        
        {!activeAction && (
          <div className="flex gap-2">
            <Button
              onClick={() => setActiveAction('send')}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Send
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveAction('receive')}
              className="flex items-center gap-2"
            >
              <QrCode className="h-4 w-4" />
              Receive
            </Button>
          </div>
        )}

        {activeAction && (
          <Button
            variant="ghost"
            onClick={closeAction}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        {activeAction === 'send' && (
          <motion.div
            key="send"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: settings.reducedMotion ? 0 : 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Send Tokens
                </CardTitle>
                <CardDescription>
                  Transfer tokens to another wallet address
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <AccessibleInput
                  label="Recipient Address"
                  description="Enter the wallet address you want to send to"
                  placeholder="0x..."
                  value={sendForm.recipient}
                  onChange={(e) => setSendForm({ ...sendForm, recipient: e.target.value })}
                  voiceInputEnabled
                  onVoiceInput={(text) => setSendForm({ ...sendForm, recipient: text })}
                  required
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <AccessibleInput
                    label="Amount"
                    description="How much do you want to send?"
                    type="number"
                    placeholder="0.00"
                    value={sendForm.amount}
                    onChange={(e) => setSendForm({ ...sendForm, amount: e.target.value })}
                    voiceInputEnabled
                    onVoiceInput={(text) => setSendForm({ ...sendForm, amount: text })}
                    required
                  />

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Token</label>
                    <div className="grid grid-cols-2 gap-2">
                      {balances.map((balance) => (
                        <Button
                          key={balance.symbol}
                          variant={sendForm.token === balance.symbol ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSendForm({ ...sendForm, token: balance.symbol })}
                          className="justify-start"
                        >
                          {balance.symbol}
                          <span className="ml-1 text-xs">
                            ({balance.balance})
                          </span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {sendForm.token && (
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">Available balance</div>
                    <div className="text-lg font-semibold">
                      {balances.find(b => b.symbol === sendForm.token)?.balance} {sendForm.token}
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleSendTransaction}
                  disabled={!sendForm.recipient || !sendForm.amount || isProcessing}
                  className="w-full min-h-touch"
                >
                  {isProcessing ? 'Processing...' : 'Send Transaction'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeAction === 'receive' && (
          <motion.div
            key="receive"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: settings.reducedMotion ? 0 : 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  Receive Tokens
                </CardTitle>
                <CardDescription>
                  Share your wallet address to receive payments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-4">
                  {/* Mock QR Code */}
                  <div className="mx-auto w-48 h-48 bg-gradient-subtle border-2 border-border rounded-lg flex items-center justify-center">
                    <QrCode className="h-24 w-24 text-muted-foreground" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Your Wallet Address
                    </label>
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      <code className="flex-1 text-sm break-all">
                        {walletAddress}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(walletAddress)}
                        aria-label="Copy wallet address"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Only send tokens to this address on supported networks
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {!activeAction && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: settings.reducedMotion ? 0 : 0.3 }}
            className="space-y-6"
          >
            {/* Wallet Address Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Wallet Address</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPrivateInfo(!showPrivateInfo)}
                    className="flex items-center gap-2"
                  >
                    {showPrivateInfo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {showPrivateInfo ? 'Hide' : 'Show'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <code className="flex-1 text-sm">
                    {showPrivateInfo ? walletAddress : `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(walletAddress)}
                    aria-label="Copy wallet address"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Token Balances */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Token Balances</h2>
              <div className="grid gap-4">
                {balances.map((balance, index) => (
                  <motion.div
                    key={balance.symbol}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: settings.reducedMotion ? 0 : 0.2, 
                      delay: settings.reducedMotion ? 0 : index * 0.1 
                    }}
                  >
                    <Card className="hover:shadow-medium transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                              <span className="text-primary-foreground font-bold">
                                {balance.symbol.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">
                                {balance.symbol}
                              </h3>
                              <p className="text-muted-foreground">
                                ${balance.usdValue.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">
                              {balance.balance.toLocaleString()}
                            </div>
                            <Badge variant="secondary" className="mt-1">
                              {balance.symbol}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};