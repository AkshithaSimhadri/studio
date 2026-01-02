'use client';

import type { FinancialGoal } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { differenceInDays, formatDistanceToNow, parseISO } from 'date-fns';
import { useState, useEffect } from 'react';
import { AddFundsDialog } from './add-funds-dialog';

type DeadlineInfo = {
  text: string;
  variant: 'destructive' | 'secondary' | 'outline';
};

export function GoalCard({ goal }: { goal: FinancialGoal }) {
  const [deadlineInfo, setDeadlineInfo] = useState<DeadlineInfo | null>(null);

  // The total amount is the remaining target plus what's already been contributed.
  const totalAmount = goal.targetAmount + goal.currentAmount;
  const progress = totalAmount > 0 ? (goal.currentAmount / totalAmount) * 100 : 100;

  useEffect(() => {
    const deadline = parseISO(goal.targetDate);
    const daysLeft = differenceInDays(deadline, new Date());

    const getDeadlineBadgeVariant = () => {
      if (daysLeft < 0) return 'destructive';
      if (daysLeft < 30) return 'secondary';
      return 'outline';
    };

    setDeadlineInfo({
      text: daysLeft < 0 ? 'Overdue' : `${formatDistanceToNow(deadline)} left`,
      variant: getDeadlineBadgeVariant(),
    });
  }, [goal.targetDate]);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="truncate">{goal.name}</CardTitle>
        <CardDescription>
          Deadline: {new Date(goal.targetDate).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 flex-grow">
        <Progress
          value={progress}
          aria-label={`${progress.toFixed(0)}% complete`}
        />
        <p className="text-sm text-muted-foreground">
          <span className="font-bold text-foreground">
            ${goal.currentAmount.toLocaleString()}
          </span>{' '}
          / ${totalAmount.toLocaleString()}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        {deadlineInfo ? (
          <Badge variant={deadlineInfo.variant}>{deadlineInfo.text}</Badge>
        ) : (
          <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
        )}
        <AddFundsDialog goal={goal} />
      </CardFooter>
    </Card>
  );
}
