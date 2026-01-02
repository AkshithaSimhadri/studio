
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
import { useState, useEffect, useMemo } from 'react';
import { AddFundsDialog } from './add-funds-dialog';
import { EditGoalDialog } from './edit-goal-dialog';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteDocumentNonBlocking, useUser, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';


type DeadlineInfo = {
  text: string;
  variant: 'destructive' | 'secondary' | 'outline' | 'default';
};

export function GoalCard({ goal }: { goal: FinancialGoal }) {
  const [deadlineInfo, setDeadlineInfo] = useState<DeadlineInfo | null>(null);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const { progress } = useMemo(() => {
    // The targetAmount is the total goal.
    // Calculate progress as a percentage of the total goal.
    // If the total is 0, consider it 100% complete.
    const prog = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 100;
    return { progress: Math.min(100, prog) }; // Cap progress at 100%
  }, [goal.currentAmount, goal.targetAmount]);


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
            <div className="flex-1 pr-2">
                <CardTitle className="truncate">{goal.name}</CardTitle>
                <CardDescription>
                Deadline: {new Date(goal.targetDate).toLocaleDateString()}
                </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 -mt-2 -mr-2">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <EditGoalDialog goal={goal}>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Pencil className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                </EditGoalDialog>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                     <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your goal
                        and all of its data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 flex-grow">
        <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span className="font-semibold">{progress.toFixed(0)}%</span>
        </div>
        <Progress
          value={progress}
          aria-label={`${progress.toFixed(0)}% complete`}
        />
        <p className="text-sm text-muted-foreground text-right">
          <span className="font-bold text-foreground">
            ${goal.currentAmount.toLocaleString()}
          </span>
          {' / '}
          <span>${goal.targetAmount.toLocaleString()}</span>
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        {deadlineInfo ? (
          <Badge variant={deadlineInfo.variant}>{deadlineInfo.text}</Badge>
        ) : (
          <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
        )}
        {progress < 100 && <AddFundsDialog goal={goal} />}
      </CardFooter>
    </Card>
  );
}
