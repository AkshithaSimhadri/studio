
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
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { differenceInDays, formatDistanceToNow, parseISO } from 'date-fns';
import { useState, useEffect } from 'react';
import { AddFundsDialog } from './add-funds-dialog';
import { EditGoalDialog } from './edit-goal-dialog';
import { Pencil } from 'lucide-react';
import { deleteDocumentNonBlocking, useUser, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

type DeadlineInfo = {
  text: string;
  variant: 'destructive' | 'secondary' | 'outline' | 'default';
};

export function GoalCard({ goal }: { goal: FinancialGoal }) {
  const [deadlineInfo, setDeadlineInfo] = useState<DeadlineInfo | null>(null);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 100;

  useEffect(() => {
    const deadline = parseISO(goal.targetDate);
    const daysLeft = differenceInDays(deadline, new Date());

    const getDeadlineBadgeVariant = (): 'destructive' | 'secondary' | 'outline' | 'default' => {
      if (progress >= 100) return 'default';
      if (daysLeft < 0) return 'destructive';
      if (daysLeft < 30) return 'secondary';
      return 'outline';
    };

    setDeadlineInfo({
      text: progress >= 100 ? 'Completed!' : daysLeft < 0 ? 'Overdue' : `${formatDistanceToNow(deadline)} left`,
      variant: getDeadlineBadgeVariant(),
    });
  }, [goal.targetDate, progress]);
  
  const handleDelete = () => {
    if (!user || !firestore) return;
    const goalRef = doc(firestore, 'users', user.uid, 'financial_goals', goal.id);
    deleteDocumentNonBlocking(goalRef);
    toast({
      title: 'Goal Deleted',
      description: `"${goal.name}" has been removed.`,
    });
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div className="flex-1">
                <CardTitle className="truncate">{goal.name}</CardTitle>
                <CardDescription>
                Deadline: {new Date(goal.targetDate).toLocaleDateString()}
                </CardDescription>
            </div>
            <EditGoalDialog goal={goal}>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mt-2 -mr-2">
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit Goal</span>
              </Button>
            </EditGoalDialog>
        </div>
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
          / ${goal.targetAmount.toLocaleString()}
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
