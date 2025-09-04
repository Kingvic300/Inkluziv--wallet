import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw, 
  Coins,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { Transaction } from '../contexts/WalletContext';
import { cn } from '../lib/utils';

interface TransactionCardProps {
  transaction: Transaction;
  onClick?: () => void;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ 
  transaction, 
  onClick 
}) => {
  const { settings, announceToScreenReader } = useAccessibility();

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'send':
        return <ArrowUpRight className="h-5 w-5" />;
      case 'receive':
        return <ArrowDownLeft className="h-5 w-5" />;
      case 'swap':
        return <RefreshCw className="h-5 w-5" />;
      case 'stake':
      case 'unstake':
        return <Coins className="h-5 w-5" />;
      default:
        return <RefreshCw className="h-5 w-5" />;
    }
  };

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const getStatusBadgeVariant = (status: Transaction['status']) => {
    switch (status) {
      case 'confirmed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
    }
  };

  const formatAmount = (amount: number, token: string) => {
    return `${amount.toLocaleString()} ${token}`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getTransactionDescription = () => {
    const baseDesc = `${transaction.type} transaction for ${formatAmount(transaction.amount, transaction.token)}`;
    const statusDesc = `Status: ${transaction.status}`;
    const dateDesc = `Date: ${formatDate(transaction.timestamp)}`;
    return `${baseDesc}. ${statusDesc}. ${dateDesc}`;
  };

  const handleCardClick = () => {
    if (onClick) {
      announceToScreenReader(`Opening transaction details for ${getTransactionDescription()}`);
      onClick();
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    announceToScreenReader(`Viewing transaction ${transaction.id} on blockchain explorer`);
    // Mock blockchain explorer link
    window.open(`https://etherscan.io/tx/${transaction.hash || transaction.id}`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: settings.reducedMotion ? 0 : 0.2 }}
      whileHover={settings.reducedMotion ? {} : { y: -2 }}
    >
      <Card 
        className={cn(
          'cursor-pointer transition-all duration-200 hover:shadow-medium',
          'focus-within:ring-2 focus-within:ring-primary'
        )}
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
          }
        }}
        aria-label={getTransactionDescription()}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            {/* Transaction Type and Icon */}
            <div className="flex items-center gap-3">
              <div className={cn(
                'p-2 rounded-full',
                transaction.type === 'send' && 'bg-destructive/10 text-destructive',
                transaction.type === 'receive' && 'bg-success/10 text-success',
                (transaction.type === 'swap' || transaction.type === 'stake' || transaction.type === 'unstake') && 'bg-primary/10 text-primary'
              )}>
                {getTransactionIcon(transaction.type)}
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-base capitalize">
                    {transaction.type}
                  </h3>
                  <Badge variant={getStatusBadgeVariant(transaction.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(transaction.status)}
                      <span className="capitalize">{transaction.status}</span>
                    </div>
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {formatDate(transaction.timestamp)}
                </p>
                
                {(transaction.from || transaction.to) && (
                  <p className="text-xs text-muted-foreground">
                    {transaction.from && `From: ${transaction.from.slice(0, 6)}...${transaction.from.slice(-4)}`}
                    {transaction.to && `To: ${transaction.to.slice(0, 6)}...${transaction.to.slice(-4)}`}
                  </p>
                )}
              </div>
            </div>

            {/* Amount and Actions */}
            <div className="text-right space-y-2">
              <div className={cn(
                'text-lg font-bold',
                transaction.type === 'send' && 'text-destructive',
                transaction.type === 'receive' && 'text-success',
                (transaction.type === 'swap' || transaction.type === 'stake' || transaction.type === 'unstake') && 'text-foreground'
              )}>
                {transaction.type === 'send' ? '-' : '+'}
                {formatAmount(transaction.amount, transaction.token)}
              </div>
              
              <div className="flex items-center gap-2">
                {transaction.hash && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleViewDetails}
                    className="p-1 h-auto"
                    aria-label="View on blockchain explorer"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};