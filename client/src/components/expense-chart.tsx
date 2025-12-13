import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Transaction } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface ExpenseChartProps {
  transactions: Transaction[];
}

export function ExpenseChart({ transactions }: ExpenseChartProps) {
  const data = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    transactions.forEach((t) => {
      if (!categoryTotals[t.category]) categoryTotals[t.category] = 0;
      categoryTotals[t.category] += t.amount;
    });

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  // Modern palette matching our CSS variables logic implicitly
  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "#8884d8",
    "#82ca9d",
  ];

  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg font-medium">Spending Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  className="stroke-background hover:opacity-80 transition-opacity cursor-pointer"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--popover))', 
                borderRadius: '8px', 
                border: '1px solid hsl(var(--border))',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              itemStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-sm text-muted-foreground font-medium">Total</span>
          <span className="text-2xl font-bold font-mono tracking-tight">${total.toFixed(0)}</span>
        </div>
      </CardContent>
      
      {/* Custom Legend */}
      <div className="grid grid-cols-2 gap-2 px-6 pb-4">
        {data.map((entry, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            key={entry.name} 
            className="flex items-center gap-2 text-xs"
          >
            <div 
              className="w-2.5 h-2.5 rounded-full shrink-0" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }} 
            />
            <span className="truncate flex-1">{entry.name}</span>
            <span className="font-mono text-muted-foreground ml-auto">
              {Math.round((entry.value / total) * 100)}%
            </span>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
