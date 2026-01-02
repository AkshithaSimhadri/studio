"use client";

import { useState } from "react";
import { UploadForm } from "@/components/upload/upload-form";
import type { ExtractedTransaction } from "@/lib/types";

import { DollarSign, TrendingUp, TrendingDown, Landmark } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import type { Expense, Income } from '@/lib/types';
import { useMemo } from 'react';
import { Button } from "../ui/button";

export function UploadDashboard() {
  const [transactions, setTransactions] = useState<ExtractedTransaction[] | null>(null);

  const { totalIncome, totalExpenses, totalBalance, savingsRate, incomes, expenses } = useMemo(() => {
    if (!transactions) {
      return { totalIncome: 0, totalExpenses: 0, totalBalance: 0, savingsRate: 0, incomes: [], expenses: [] };
    }

    const incs = transactions.filter(t => t.type === 'income').map(t => ({...t, id: Math.random().toString(), source: t.description } as Income));
    const exps = transactions.filter(t => t.type === 'expense').map(t => ({...t, id: Math.random().toString() } as Expense));

    const income = incs.reduce((sum, item) => sum + item.amount, 0);
    const expense = exps.reduce((sum, item) => sum + item.amount, 0);
    const balance = income - expense;
    const rate = income > 0 ? ((balance / income) * 100) : 0;
    return {
      totalIncome: income,
      totalExpenses: expense,
      totalBalance: balance,
      savingsRate: rate,
      incomes: incs,
      expenses: exps,
    };
  }, [transactions]);
  
  const handleReset = () => {
    setTransactions(null);
  }

  if (transactions) {
    return (
       <div className="flex-1 space-y-4">
        <div className="flex justify-end">
            <Button variant="outline" onClick={handleReset}>Upload Another File</Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
                title="Total Balance"
                value={totalBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                icon={Landmark}
            />
            <StatCard 
                title="Total Income"
                value={totalIncome.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                icon={TrendingUp}
            />
            <StatCard 
                title="Total Expenses"
                value={totalExpenses.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                icon={TrendingDown}
            />
            <StatCard 
                title="Savings Rate"
                value={`${savingsRate.toFixed(1)}%`}
                icon={DollarSign}
            />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="lg:col-span-4">
                <OverviewChart incomes={incomes} expenses={expenses} isLoading={false} />
            </div>
            <div className="lg:col-span-3">
                <RecentTransactions expenses={expenses} incomes={incomes} isLoading={false} />
            </div>
        </div>
    </div>
    )
  }

  return <UploadForm onUploadSuccess={setTransactions} />;
}
