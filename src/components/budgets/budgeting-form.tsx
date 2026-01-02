
'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PiggyBank, Lightbulb, Loader2 } from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Income, Expense } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

const genericSavingsTips = [
    "Review your subscriptions and cancel any you don't use.",
    "Try meal prepping to save money on dining out.",
    "Automate your savings by setting up regular transfers to a savings account.",
    "Look for generic brands instead of name brands to save on groceries.",
    "Use a programmable thermostat to save on heating and cooling costs."
];

export function BudgetingForm() {
  const [recommendations, setRecommendations] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useUser();
  const firestore = useFirestore();

  const incomesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'incomes');
  }, [user, firestore]);

  const expensesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'expenses');
  }, [user, firestore]);

  const { data: incomes, isLoading: isLoadingIncomes } = useCollection<Income>(incomesQuery);
  const { data: expenses, isLoading: isLoadingExpenses } = useCollection<Expense>(expensesQuery);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setRecommendations(null);

    if (!incomes || !expenses) {
      setError("Could not fetch financial data. Please try again.");
      setLoading(false);
      return;
    }

    const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);

    if (totalIncome === 0) {
        setRecommendations({
            budgetRecommendations: [],
            savingsTips: ["Please add your income sources to generate a budget plan."]
        });
        setLoading(false);
        return;
    }

    const needsSpend = expenses
        .filter(e => ["Groceries", "Bills & Utilities", "Transport", "Health", "Rent"].includes(e.category))
        .reduce((sum, e) => sum + e.amount, 0);

    const wantsSpend = expenses
        .filter(e => ["Food", "Shopping", "Entertainment", "Travel"].includes(e.category))
        .reduce((sum, e) => sum + e.amount, 0);

    const needsTarget = totalIncome * 0.5;
    const wantsTarget = totalIncome * 0.3;
    const savingsTarget = totalIncome * 0.2;
    
    const budgetRecommendations = [
        {
            category: "Needs",
            recommendedAmount: needsTarget,
            rationale: `You're currently spending $${needsSpend.toFixed(2)}. The 50/30/20 rule suggests a target of $${needsTarget.toFixed(2)}.`
        },
        {
            category: "Wants",
            recommendedAmount: wantsTarget,
            rationale: `You're currently spending $${wantsSpend.toFixed(2)}. The 50/30/20 rule suggests a target of $${wantsTarget.toFixed(2)}.`
        },
        {
            category: "Savings",
            recommendedAmount: savingsTarget,
            rationale: `Based on your income, you should aim to save at least $${savingsTarget.toFixed(2)} per month.`
        }
    ];

    setRecommendations({
        budgetRecommendations,
        savingsTips: genericSavingsTips,
    });

    setLoading(false);
  };

  const isDataLoading = isLoadingIncomes || isLoadingExpenses;

  return (
    <div className="space-y-6">
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="font-headline">Get Your Personalized Budget Plan</CardTitle>
          <CardDescription>
            Let our AI analyze your spending and create a budget to help you reach your goals faster.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleSubmit} disabled={loading || isDataLoading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Your Finances...
              </>
            ) : isDataLoading ? (
                 <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading Your Data...
              </>
            ) : (
              "Generate My Budget Plan"
            )}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive">
          <CardHeader><CardTitle className="text-destructive">An Error Occurred</CardTitle></CardHeader>
          <CardContent><p>{error}</p></CardContent>
        </Card>
      )}

      {recommendations && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PiggyBank className="text-primary" /> 50/30/20 Budget Recommendations
              </CardTitle>
              <CardDescription>Based on your spending, here is a suggested budget.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendations.budgetRecommendations.map((rec: any, index: number) => (
                <div key={index} className="p-4 rounded-lg border">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{rec.category}</h3>
                    <p className="font-bold text-primary">${rec.recommendedAmount.toFixed(2)}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{rec.rationale}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="text-accent" /> General Savings Tips
              </CardTitle>
              <CardDescription>Actionable tips to help you save more.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 list-disc list-inside">
                {recommendations.savingsTips.map((tip: string, index: number) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
