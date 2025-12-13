import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/theme-provider";
import { Transaction, MOCK_TRANSACTIONS } from "@/lib/mock-data";
import { ExpenseChart } from "@/components/expense-chart";
import { SMSParser } from "@/components/sms-parser";
import { ExportButtons } from "@/components/export-buttons";
import { 
  Bell, 
  Settings, 
  Menu, 
  Plus, 
  Search,
  Wallet,
  TrendingDown,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { theme, setTheme } = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [loading, setLoading] = useState(true);

  // Simulate initial load
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSMSScan = () => {
    // Add some dummy "new" transactions on scan
    const newTx: Transaction = {
      id: Math.random().toString(),
      date: new Date().toISOString().split('T')[0],
      merchant: "NEW SMS FOUND",
      amount: 45.00,
      category: "Uncategorized",
      type: "debit",
      source: "SMS"
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const totalSpent = transactions.reduce((acc, curr) => acc + curr.amount, 0);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground font-medium animate-pulse">Loading Finances...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 md:pb-0 transition-colors duration-500">
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-xl border-b border-border p-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-full -ml-2">
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold tracking-tight">FinTrack</h1>
          </div>
          <div className="flex items-center gap-2">
             <Button variant="ghost" size="icon" className="rounded-full relative">
               <Bell className="h-5 w-5" />
               <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-background" />
             </Button>
            <Avatar className="h-8 w-8 cursor-pointer border-2 border-primary/20" onClick={() => setLocation("/profile")}>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-6">
        
        {/* Balance Card */}
        <section>
          <div className="flex justify-between items-end mb-2 px-1">
             <h2 className="text-sm font-medium text-muted-foreground">Total Balance</h2>
             <span className="text-xs font-mono text-green-500 flex items-center gap-1 bg-green-500/10 px-2 py-0.5 rounded-full">
               <ArrowUpRight size={12} /> +2.4%
             </span>
          </div>
          <div className="text-4xl font-bold tracking-tight mb-6">
            $12,450<span className="text-muted-foreground/50">.82</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
             <Button 
                onClick={() => setTheme('blue')} 
                variant={theme === 'blue' ? "default" : "outline"}
                className={`w-full ${theme === 'blue' ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
             >
               Blue
             </Button>
             <Button 
                onClick={() => setTheme('white')} 
                variant={theme === 'white' ? "default" : "outline"}
                className={`w-full ${theme === 'white' ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
             >
               White
             </Button>
             <Button 
                onClick={() => setTheme('black')} 
                variant={theme === 'black' ? "default" : "outline"}
                className={`w-full ${theme === 'black' ? 'ring-2 ring-offset-2 ring-gray-900' : ''}`}
             >
               Black
             </Button>
          </div>
        </section>

        {/* SMS Sync Block */}
        <SMSParser onScanComplete={handleSMSScan} />

        {/* Analytics Block */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Monthly Expenses</h3>
            <span className="text-sm text-muted-foreground bg-secondary px-2 py-1 rounded-md">
              May 2024
            </span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-card rounded-3xl p-4 shadow-sm border border-border">
              <ExpenseChart transactions={transactions} />
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="bg-card rounded-3xl p-6 shadow-sm border border-border flex-1 flex flex-col justify-center gap-2">
                <span className="text-sm text-muted-foreground">Total Spent</span>
                <div className="text-3xl font-bold flex items-center gap-2">
                  ${totalSpent.toFixed(2)}
                  <TrendingDown className="text-red-500 h-6 w-6" />
                </div>
                <p className="text-xs text-muted-foreground">
                  $420 more than last month
                </p>
              </div>
              
               <div className="bg-card rounded-3xl p-6 shadow-sm border border-border">
                  <h4 className="font-medium mb-4 text-sm">Export Data</h4>
                  <ExportButtons transactions={transactions} />
               </div>
            </div>
          </div>
        </section>

        {/* Transactions List */}
        <section className="pb-20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Recent Transactions</h3>
            <Button variant="ghost" size="sm" className="text-primary">See All</Button>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9 bg-secondary/50 border-none" placeholder="Search transactions..." />
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {transactions.map((tx, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={tx.id}
                  className="group flex items-center justify-between p-4 bg-card hover:bg-accent/50 transition-colors rounded-2xl border border-border/50 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-xl">
                      {tx.category === 'Food & Dining' ? '🍔' : 
                       tx.category === 'Transportation' ? '🚗' : 
                       tx.category === 'Shopping' ? '🛍️' : 
                       tx.category === 'Entertainment' ? '🎬' : '💸'}
                    </div>
                    <div>
                      <p className="font-medium leading-none">{tx.merchant}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{tx.date}</span>
                        {tx.source === 'SMS' && (
                          <span className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-1.5 py-0.5 rounded font-medium">
                            SMS
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="font-mono font-medium">
                    -${tx.amount.toFixed(2)}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </main>
      
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button size="icon" className="h-14 w-14 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-transform hover:scale-105">
          <Plus className="h-6 w-6" />
        </Button>
      </div>

    </div>
  );
}
