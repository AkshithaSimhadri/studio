'use client';

import { useState } from 'react';
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
import { PiggyBank } from 'lucide-react';
import { useUser, useFirestore, updateDocumentNonBlocking } from '@/firebase';
import { doc, increment } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { FinancialGoal } from '@/lib/types';

export function AddFundsDialog({ goal }: { goal: FinancialGoal }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [amount, setAmount] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    const fundAmount = parseFloat(amount);
    if (isNaN(fundAmount) || fundAmount <= 0 || !user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Invalid Amount',
        description: 'Please enter a valid positive number.',
      });
      return;
    }

    const goalRef = doc(firestore, 'users', user.uid, 'financial_goals', goal.id);

    // This will decrease the target amount by the fund amount.
    // We also increment the current amount to track total contributions.
    await updateDocumentNonBlocking(goalRef, {
      targetAmount: increment(-fundAmount),
      currentAmount: increment(fundAmount)
    });

    toast({
      title: 'Funds Added',
      description: `$${fundAmount.toFixed(
        2
      )} has been added to your "${goal.name}" goal.`,
    });

    // Reset form and close dialog
    setAmount('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <PiggyBank className="h-4 w-4" />
          Add Funds
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Funds to "{goal.name}"</DialogTitle>
          <DialogDescription>
            Your current progress is $
            {goal.currentAmount.toLocaleString()} / $
            {(goal.targetAmount + goal.currentAmount).toLocaleString()}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              className="col-span-3"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit}>
            Save contribution
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
