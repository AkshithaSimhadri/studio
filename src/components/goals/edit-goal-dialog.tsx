
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { useUser, useFirestore, updateDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { FinancialGoal } from '@/lib/types';
import { format } from 'date-fns';

type EditGoalDialogProps = {
  goal: FinancialGoal;
  children: React.ReactNode;
};

export function EditGoalDialog({ goal, children }: EditGoalDialogProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  // The total goal is the sum of what's saved and what's remaining.
  const [totalGoalAmount, setTotalGoalAmount] = useState('0');
  const [name, setName] = useState(goal.name);
  const [targetDate, setTargetDate] = useState('');
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    if (goal) {
        setName(goal.name);
        const total = goal.currentAmount + goal.targetAmount;
        setTotalGoalAmount(total.toString());
        setTargetDate(format(new Date(goal.targetDate), 'yyyy-MM-dd'));
    }
  }, [goal]);


  const handleSubmit = async () => {
    if (!name || !totalGoalAmount || !targetDate || !user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please fill out all fields.',
      });
      return;
    }

    const goalRef = doc(firestore, 'users', user.uid, 'financial_goals', goal.id);

    const newTotalAmount = parseFloat(totalGoalAmount);
    // The new targetAmount (remaining) is the new total minus what's already saved.
    const newRemainingAmount = newTotalAmount - goal.currentAmount;


    updateDocumentNonBlocking(goalRef, {
      name,
      targetAmount: newRemainingAmount, // This is the new remaining amount
      targetDate: new Date(targetDate).toISOString(),
    });

    toast({
      title: 'Goal Updated',
      description: `Your goal "${name}" has been updated.`,
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Financial Goal</DialogTitle>
          <DialogDescription>
            Make changes to your goal. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Goal Name
            </Label>
            <Input
              id="name"
              className="col-span-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="target" className="text-right">
              Total Target
            </Label>
            <Input
              id="target"
              type="number"
              className="col-span-3"
              value={totalGoalAmount}
              onChange={(e) => setTotalGoalAmount(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="deadline" className="text-right">
              Deadline
            </Label>
            <Input
              id="deadline"
              type="date"
              className="col-span-3"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
