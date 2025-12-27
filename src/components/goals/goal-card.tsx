import type { Goal } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { differenceInDays, formatDistanceToNow, parseISO } from 'date-fns';

export function GoalCard({ goal }: { goal: Goal }) {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const deadline = parseISO(goal.deadline);
  const daysLeft = differenceInDays(deadline, new Date());
  
  const getDeadlineBadgeVariant = () => {
    if (daysLeft < 0) return 'destructive';
    if (daysLeft < 30) return 'secondary';
    return 'outline';
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="truncate">{goal.name}</CardTitle>
        <CardDescription>
          Deadline: {new Date(goal.deadline).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Progress value={progress} aria-label={`${progress.toFixed(0)}% complete`} />
        <p className="text-sm text-muted-foreground">
          <span className="font-bold text-foreground">
            ${goal.currentAmount.toLocaleString()}
          </span>{" "}
          / ${goal.targetAmount.toLocaleString()}
        </p>
      </CardContent>
      <CardFooter>
        <Badge variant={getDeadlineBadgeVariant()}>
          {daysLeft < 0 ? 'Overdue' : `${formatDistanceToNow(deadline)} left`}
        </Badge>
      </CardFooter>
    </Card>
  );
}
