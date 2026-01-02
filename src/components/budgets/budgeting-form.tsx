
"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PiggyBank, Lightbulb, Loader2 } from "lucide-react";
import type { FullBudgetingRecommendationsOutput } from "@/ai/flows/budgeting-recommendations.types";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from 'firebase/firestore';
import type { Category, Expense, Income } from "@/lib/types";

const needsCategories: Category[] = ["Groceries", "Bills & Utilities", "Transport", "Health", "Rent"];
const wantsCategories: Category[] = ["Food", "Shopping", "Entertainment", "Travel"];

export function BudgetingForm() {
  const [recommendations, setRecommendations] = useState<FullBudgetingRecommendationsOutput | null>(null);
  const [showResults, setShowResults] = useState(false);

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

  const loading = isLoadingIncomes || isLoadingExpenses;

  const generatedRecommendations = useMemo(() => {
    if (!incomes || !expenses) {
      return null;
    }
    
    const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);

    if (totalIncome === 0) {
      return {
        budgetRecommendations: [],
        savingsTips: ["Start by adding some income to create a budget plan."]
      };
    }

    const needsSpend = expenses
        .filter(e => needsCategories.includes(e.category))
        .reduce((sum, e) => sum + e.amount, 0);

    const wantsSpend = expenses
        .filter(e => wantsCategories.includes(e.category))
        .reduce((sum, e) => sum + e.amount, 0);

    const needsTarget = totalIncome * 0.5;
    const wantsTarget = totalIncome * 0.3;
    const savingsTarget = totalIncome * 0.2;

    const budgetRecommendations = [
        {
            category: "Needs",
            recommendedAmount: needsTarget,
            rationale: `You are currently spending $${needsSpend.toFixed(2)}. The 50/30/20 rule suggests a target of $${needsTarget.toFixed(2)}.`
        },
        {
            category: "Wants",
            recommendedAmount: wantsTarget,
            rationale: `You are currently spending $${wantsSpend.toFixed(2)}. The 50/30/20 rule suggests a target of $${wantsTarget.toFixed(2)}.`
        },
        {
            category: "Savings",
            recommendedAmount: savingsTarget,
            rationale: `Based on the 50/30/20 rule, you should aim to save at least $${savingsTarget.toFixed(2)} per month.`
        }
    ];

    const savingsTips = [
        "Review your subscriptions and cancel any you don't use.",
        "Try cooking at home more often instead of eating out.",
        "Set up automatic transfers to a high-yield savings account.",
        "Look for generic brands for common household items.",
        "Use a programmable thermostat to save on energy bills."
    ];

    return {
      budgetRecommendations,
      savingsTips,
    };
  }, [incomes, expenses]);


  const handleSubmit = () => {
    setShowResults(true);
    setRecommendations(generatedRecommendations);
  };

  return (
    <div className="space-y-6">
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="font-headline">Get Your Personalized Budget Plan</CardTitle>
          <CardDescription>
            Let's analyze your spending and create a budget to help you reach your goals faster.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading Data...
              </>
            ) : (
              "Generate My Budget"
            )}
          </Button>
        </CardContent>
      </Card>

      {showResults && recommendations && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PiggyBank className="text-primary" /> 50/30/20 Budget Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendations.budgetRecommendations.map((rec, index) => (
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
                <Lightbulb className="text-accent" /> Common Savings Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 list-disc list-inside">
                {recommendations.savingsTips.map((tip, index) => (
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
