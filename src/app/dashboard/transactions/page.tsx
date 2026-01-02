'use client';

import { TransactionsTable } from '@/components/transactions/transactions-table';
import { AddTransactionSheet } from '@/components/transactions/add-transaction-sheet';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Expense, Income } from '@/lib/types';

export default function TransactionsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const expensesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'expenses');
  }, [user, firestore]);

  const incomesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'incomes');
  }, [user, firestore]);

  const { data: expenses, isLoading: isLoadingExpenses } = useCollection<Expense>(expensesQuery);
  const { data: incomes, isLoading: isLoadingIncomes } = useCollection<Income>(incomesQuery);
  
  const transactions = [
    ...(incomes || []).map(item => ({ ...item, type: 'income' as const })),
    ...(expenses || []).map(item => ({ ...item, type: 'expense' as const })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Transactions
          </h1>
          <p className="text-muted-foreground">
            View and manage your income and expenses.
          </p>
        </div>
        <AddTransactionSheet />
      </div>
      <TransactionsTable transactions={transactions} isLoading={isLoadingExpenses || isLoadingIncomes} />
    </div>
  );
}
