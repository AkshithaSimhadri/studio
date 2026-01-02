
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PiggyBank, Lightbulb, Loader2 } from "lucide-react";
import type { FullBudgetingRecommendationsOutput } from "@/ai/flows/budgeting-recommendations.types";
import { useUser, useAuth } from "@/firebase";

export function BudgetingForm() {
  const [recommendations, setRecommendations] = useState<FullBudgetingRecommendationsOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setRecommendations(null);

    if (!user) {
      setError("You must be logged in to get recommendations.");
      setLoading(false);
      return;
    }

    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch recommendations');
      }
      
      const result = await response.json();
      setRecommendations(result);
    } catch(e: any) {
        setError(e.message || "An unexpected error occurred.");
    } finally {
        setLoading(false);
    }
  };

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
          <Button onClick={handleSubmit} disabled={loading || isUserLoading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Your Finances...
              </>
            ) : (
              "Generate My AI Budget"
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
                <PiggyBank className="text-primary" /> AI Budget Recommendations
              </CardTitle>
              <CardDescription>Based on your spending, here is a suggested budget.</CardDescription>
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
                <Lightbulb className="text-accent" /> Personalized Savings Tips
              </CardTitle>
              <CardDescription>Actionable tips from our AI to help you save more.</CardDescription>
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
