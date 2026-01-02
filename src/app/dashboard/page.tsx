'use client';

import { DollarSign, TrendingUp, TrendingDown, Landmark } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { GoalCard } from "@/components/goals/goal-card";
import { AddGoalDialog } from "@/components/goals/add-goal-dialog";
import type { Expense, FinancialGoal, Income } from '@/lib/types';
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from 'firebase/firestore';
import { useMemo }s from 'react';
import { Skeleton } from "@/components/ui/skeleton";

function StatSkeletons() {
  return (
    <>
      <Skeleton className="h-28 w-full" />
      <Skeleton className="h-28 w-full" />
      <Skeleton className="h-28 w-full" />
      <Skeleton className="h-28 w-full" />
    </>
  );
}

export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const expensesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'expenses');
  }, [firestore, user]);

  const incomesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'incomes');
  }, [firestore, user]);

  const goalsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'financial_goals');
  }, [firestore, user]);
  
  const { data: expenses, isLoading: isLoadingExpenses } = useCollection<Expense>(expensesQuery);
  const { data: incomes, isLoading: isLoadingIncomes } = useCollection<Income>(incomesQuery);
  const { data: goals, isLoading: isLoadingGoals } = useCollection<FinancialGoal>(goalsQuery);

  const { totalIncome, totalExpenses, totalBalance, savingsRate } = useMemo(() => {
    const income = incomes?.reduce((sum, item) => sum + item.amount, 0) || 0;
    const expense = expenses?.reduce((sum, item) => sum + item.amount, 0) || 0;
    const balance = income - expense;
    const rate = income > 0 ? ((balance / income) * 100) : 0;
    return {
      totalIncome: income,
      totalExpenses: expense,
      totalBalance: balance,
      savingsRate: rate
    };
  }, [incomes, expenses]);

  const isLoadingStats = isLoadingIncomes || isLoadingExpenses;

  return (
    <div className="flex-1 space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {isLoadingStats ? <StatSkeletons/> : (
              <>
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
              </>
            )}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="lg:col-span-4">
                <OverviewChart incomes={incomes || []} expenses={expenses || []} isLoading={isLoadingStats} />
            </div>
            <div className="lg:col-span-3">
                <RecentTransactions expenses={expenses || []} incomes={incomes || []} isLoading={isLoadingStats} />
            </div>
        </div>
         <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Financial Goals</h2>
            <AddGoalDialog />
          </div>
           {isLoadingGoals ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {goals?.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          )}
        </div>
    </div>
  );
}
