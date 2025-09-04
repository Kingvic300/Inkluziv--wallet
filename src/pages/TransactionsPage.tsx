import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search, Download, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { AccessibleInput } from '../components/AccessibleInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { TransactionCard } from '../components/TransactionCard';
import { useWallet } from '../contexts/WalletContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { Transaction } from '../contexts/WalletContext';

export const TransactionsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  const { transactions } = useWallet();
  const { settings, announceToScreenReader } = useAccessibility();

  // Filter transactions based on search and filters
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = searchTerm === '' || 
      transaction.token.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusStats = () => {
    const confirmed = transactions.filter(t => t.status === 'confirmed').length;
    const pending = transactions.filter(t => t.status === 'pending').length;
    const failed = transactions.filter(t => t.status === 'failed').length;
    
    return { confirmed, pending, failed, total: transactions.length };
  };

  const handleExport = () => {
    announceToScreenReader('Exporting transaction history as CSV');
    // Mock CSV export
    const csvContent = transactions.map(t => 
      `${t.timestamp.toISOString()},${t.type},${t.amount},${t.token},${t.status}`
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = getStatusStats();

  React.useEffect(() => {
    announceToScreenReader(`Transaction history loaded. Showing ${filteredTransactions.length} of ${transactions.length} transactions`);
  }, [filteredTransactions.length, transactions.length, announceToScreenReader]);

  return (
    <motion.div
      className="container mx-auto px-4 py-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: settings.reducedMotion ? 0 : 0.3 }}
    >
      {/* Page Header */}
      <motion.div 
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: settings.reducedMotion ? 0 : 0.3, delay: 0.1 }}
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Transaction History
          </h1>
          <p className="text-muted-foreground">
            View and manage all your wallet transactions
          </p>
        </div>
        
        <Button
          onClick={handleExport}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: settings.reducedMotion ? 0 : 0.3, delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">{stats.confirmed}</div>
            <div className="text-sm text-muted-foreground">Confirmed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-warning">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">{stats.failed}</div>
            <div className="text-sm text-muted-foreground">Failed</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: settings.reducedMotion ? 0 : 0.3, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
            <CardDescription>
              Search and filter your transaction history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <AccessibleInput
                label="Search transactions"
                placeholder="Search by token, type, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                voiceInputEnabled
                onVoiceInput={setSearchTerm}
              />
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Transaction Type
                </label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="min-h-touch">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border shadow-medium">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="send">Send</SelectItem>
                    <SelectItem value="receive">Receive</SelectItem>
                    <SelectItem value="swap">Swap</SelectItem>
                    <SelectItem value="stake">Stake</SelectItem>
                    <SelectItem value="unstake">Unstake</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Status
                </label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="min-h-touch">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border shadow-medium">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Transaction Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: settings.reducedMotion ? 0 : 0.3, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Transactions ({filteredTransactions.length})
              </CardTitle>
              {searchTerm || filterType !== 'all' || filterStatus !== 'all' ? (
                <Badge variant="secondary">
                  Filtered
                </Badge>
              ) : null}
            </div>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length > 0 ? (
              <div className="space-y-4">
                {filteredTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: settings.reducedMotion ? 0 : 0.2, 
                      delay: settings.reducedMotion ? 0 : index * 0.05 
                    }}
                  >
                    <TransactionCard
                      transaction={transaction}
                      onClick={() => {
                        announceToScreenReader(`Opening details for ${transaction.type} transaction of ${transaction.amount} ${transaction.token}`);
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto" />
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-foreground">
                    No transactions found
                  </h3>
                  <p className="text-muted-foreground">
                    {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                      ? 'Try adjusting your search criteria or filters'
                      : 'Your transaction history will appear here as you use your wallet'
                    }
                  </p>
                </div>
                {(searchTerm || filterType !== 'all' || filterStatus !== 'all') && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('');
                      setFilterType('all');
                      setFilterStatus('all');
                      announceToScreenReader('Filters cleared, showing all transactions');
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};