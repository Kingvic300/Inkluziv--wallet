import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Coins, 
  TrendingUp, 
  Lock, 
  Unlock,
  Plus,
  Minus,
  Info,
  Calculator
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { AccessibleInput } from '../components/AccessibleInput';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useWallet } from '../contexts/WalletContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useToast } from '../hooks/use-toast';
import { cn } from '../lib/utils';

export const StakingPage: React.FC = () => {
  const [selectedPool, setSelectedPool] = useState<string | null>(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [activeTab, setActiveTab] = useState<'stake' | 'unstake'>('stake');

  const { stakingPools, balances, stakeTokens, unstakeTokens } = useWallet();
  const { settings, announceToScreenReader } = useAccessibility();
  const { toast } = useToast();

  const selectedPoolData = stakingPools.find(p => p.id === selectedPool);
  const availableBalance = balances.find(b => b.symbol === selectedPoolData?.token)?.balance || 0;

  const handleStake = async () => {
    if (!selectedPool || !stakeAmount) return;

    setIsStaking(true);
    announceToScreenReader('Processing stake transaction');

    // Mock staking process
    await new Promise(resolve => setTimeout(resolve, 2000));

    stakeTokens(selectedPool, parseFloat(stakeAmount));

    toast({
      title: 'Staking Successful',
      description: `Staked ${stakeAmount} ${selectedPoolData?.token}`,
    });

    setIsStaking(false);
    setStakeAmount('');
    setSelectedPool(null);
  };

  const handleUnstake = async () => {
    if (!selectedPool || !unstakeAmount) return;

    setIsUnstaking(true);
    announceToScreenReader('Processing unstake transaction');

    // Mock unstaking process
    await new Promise(resolve => setTimeout(resolve, 2000));

    unstakeTokens(selectedPool, parseFloat(unstakeAmount));

    toast({
      title: 'Unstaking Initiated',
      description: `Unstaking ${unstakeAmount} ${selectedPoolData?.token}`,
    });

    setIsUnstaking(false);
    setUnstakeAmount('');
    setSelectedPool(null);
  };

  const calculateRewards = (amount: string, apy: number) => {
    if (!amount || isNaN(parseFloat(amount))) return 0;
    return (parseFloat(amount) * apy / 100).toFixed(6);
  };

  const getTotalPortfolioStaked = () => {
    return stakingPools.reduce((sum, pool) => sum + pool.userStaked, 0);
  };

  const getTotalRewards = () => {
    return stakingPools.reduce((sum, pool) => sum + pool.rewards, 0);
  };

  React.useEffect(() => {
    announceToScreenReader(`Staking dashboard loaded. Total staked: ${getTotalPortfolioStaked().toFixed(2)} tokens`);
  }, []);

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
          Staking Dashboard
        </h1>
        <p className="text-muted-foreground">
          Stake your tokens to earn rewards and support network security
        </p>
      </motion.div>

      {/* Staking Overview */}
      <motion.div
        className="grid md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: settings.reducedMotion ? 0 : 0.3, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lock className="h-5 w-5" />
              Total Staked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {getTotalPortfolioStaked().toFixed(2)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Across {stakingPools.filter(p => p.userStaked > 0).length} pools
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5" />
              Total Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">
              {getTotalRewards().toFixed(4)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Earned rewards pending claim
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calculator className="h-5 w-5" />
              Avg APY
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {(stakingPools.reduce((sum, pool) => sum + pool.apy, 0) / stakingPools.length).toFixed(1)}%
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Average across all pools
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Active Positions */}
      {stakingPools.some(pool => pool.userStaked > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: settings.reducedMotion ? 0 : 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>My Staking Positions</CardTitle>
              <CardDescription>
                Your active staking positions and earned rewards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stakingPools
                  .filter(pool => pool.userStaked > 0)
                  .map((pool, index) => (
                    <motion.div
                      key={pool.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        duration: settings.reducedMotion ? 0 : 0.2, 
                        delay: settings.reducedMotion ? 0 : index * 0.1 
                      }}
                      className="p-4 bg-muted rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                              <Coins className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{pool.name}</h3>
                              <Badge variant="secondary">{pool.apy}% APY</Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Staked: </span>
                              <span className="font-medium">{pool.userStaked} {pool.token}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Rewards: </span>
                              <span className="font-medium text-success">{pool.rewards.toFixed(4)} {pool.token}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedPool(pool.id);
                              setActiveTab('stake');
                              announceToScreenReader(`Selected ${pool.name} for additional staking`);
                            }}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedPool(pool.id);
                              setActiveTab('unstake');
                              announceToScreenReader(`Selected ${pool.name} for unstaking`);
                            }}
                          >
                            <Minus className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Available Staking Pools */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: settings.reducedMotion ? 0 : 0.3, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Available Staking Pools</CardTitle>
            <CardDescription>
              Choose from our selection of high-yield staking opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {stakingPools.map((pool, index) => (
                <motion.div
                  key={pool.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: settings.reducedMotion ? 0 : 0.2, 
                    delay: settings.reducedMotion ? 0 : index * 0.1 
                  }}
                  className={cn(
                    'p-6 border-2 rounded-lg cursor-pointer transition-all',
                    selectedPool === pool.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  )}
                  onClick={() => {
                    setSelectedPool(pool.id);
                    announceToScreenReader(`Selected ${pool.name} staking pool with ${pool.apy}% APY`);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedPool(pool.id);
                    }
                  }}
                  aria-label={`${pool.name} staking pool, ${pool.apy}% APY`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground font-bold">
                          {pool.token.charAt(0)}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">{pool.name}</h3>
                        <div className="flex items-center gap-4 text-sm">
                          <Badge variant="default" className="bg-success text-success-foreground">
                            {pool.apy}% APY
                          </Badge>
                          <span className="text-muted-foreground">
                            TVL: {pool.totalStaked.toLocaleString()} {pool.token}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {pool.userStaked > 0 && (
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Your stake</div>
                        <div className="font-semibold">
                          {pool.userStaked} {pool.token}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stake/Unstake Modal */}
      {selectedPool && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: settings.reducedMotion ? 0 : 0.2 }}
        >
          <Card className="border-primary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {activeTab === 'stake' ? (
                    <Lock className="h-5 w-5" />
                  ) : (
                    <Unlock className="h-5 w-5" />
                  )}
                  {activeTab === 'stake' ? 'Stake' : 'Unstake'} {selectedPoolData?.token}
                </CardTitle>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectedPool(null);
                    setStakeAmount('');
                    setUnstakeAmount('');
                  }}
                >
                  Close
                </Button>
              </div>
              <CardDescription>
                {selectedPoolData?.name} • {selectedPoolData?.apy}% APY
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tab Selection */}
              <div className="flex bg-muted p-1 rounded-lg">
                <Button
                  variant={activeTab === 'stake' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('stake')}
                  className="flex-1"
                >
                  Stake
                </Button>
                <Button
                  variant={activeTab === 'unstake' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('unstake')}
                  className="flex-1"
                >
                  Unstake
                </Button>
              </div>

              {activeTab === 'stake' ? (
                <div className="space-y-4">
                  <AccessibleInput
                    label="Amount to stake"
                    description={`Available: ${availableBalance.toFixed(4)} ${selectedPoolData?.token}`}
                    placeholder="0.0"
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    voiceInputEnabled
                    onVoiceInput={setStakeAmount}
                  />

                  {stakeAmount && (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Estimated annual rewards: {calculateRewards(stakeAmount, selectedPoolData?.apy || 0)} {selectedPoolData?.token}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    onClick={handleStake}
                    disabled={!stakeAmount || isStaking || parseFloat(stakeAmount) > availableBalance}
                    className="w-full min-h-touch"
                  >
                    {isStaking ? 'Staking...' : `Stake ${selectedPoolData?.token}`}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <AccessibleInput
                    label="Amount to unstake"
                    description={`Staked: ${selectedPoolData?.userStaked.toFixed(4)} ${selectedPoolData?.token}`}
                    placeholder="0.0"
                    type="number"
                    value={unstakeAmount}
                    onChange={(e) => setUnstakeAmount(e.target.value)}
                    voiceInputEnabled
                    onVoiceInput={setUnstakeAmount}
                  />

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Unstaking may have a cooldown period. Your tokens will be available after the unstaking process completes.
                    </AlertDescription>
                  </Alert>

                  <Button
                    onClick={handleUnstake}
                    disabled={!unstakeAmount || isUnstaking || parseFloat(unstakeAmount) > (selectedPoolData?.userStaked || 0)}
                    className="w-full min-h-touch"
                    variant="destructive"
                  >
                    {isUnstaking ? 'Unstaking...' : `Unstake ${selectedPoolData?.token}`}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};