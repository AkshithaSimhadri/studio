'use client';

import { GoalCard } from '@/components/goals/goal-card';
import { AddGoalDialog } from '@/components/goals/add-goal-dialog';
import type { FinancialGoal } from '@/lib/types';
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function GoalsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const goalsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'financial_goals');
  }, [user, firestore]);

  const { data: goals, isLoading } = useCollection<FinancialGoal>(goalsQuery);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Financial Goals</h1>
          <p className="text-muted-foreground">
            Track your progress towards your dreams.
          </p>
        </div>
        <AddGoalDialog />
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {goals?.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}
    </div>
  );
}
