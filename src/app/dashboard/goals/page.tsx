'use client';

import { useState } from 'react';
import { placeholderGoals } from '@/lib/placeholder-data';
import { GoalCard } from '@/components/goals/goal-card';
import { AddGoalDialog } from '@/components/goals/add-goal-dialog';
import type { Goal } from '@/lib/types';

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(placeholderGoals);

  const addGoal = (newGoal: Omit<Goal, 'id' | 'currentAmount'>) => {
    setGoals((prevGoals) => [
      {
        id: `g${Date.now()}`,
        currentAmount: 0,
        ...newGoal,
      },
      ...prevGoals,
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Financial Goals</h1>
          <p className="text-muted-foreground">
            Track your progress towards your dreams.
          </p>
        </div>
        <AddGoalDialog onAddGoal={addGoal} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
    </div>
  );
}
