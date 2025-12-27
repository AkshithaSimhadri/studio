"use server";

import { budgetingRecommendations } from "@/ai/flows/budgeting-recommendations";
import { 
  type BudgetingRecommendationsOutput, 
  BudgetingRecommendationsOutputSchema 
} from "@/ai/flows/budgeting-recommendations.types";
import { placeholderTransactions } from "@/lib/placeholder-data";

export async function getBudgetingRecommendations(): Promise<BudgetingRecommendationsOutput | { error: string }> {
  try {
    const income = placeholderTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = placeholderTransactions
      .filter(t => t.type === 'expense')
      .map(t => ({ category: t.category, amount: t.amount }));

    const recommendationsString = await budgetingRecommendations({
      income,
      expenses,
    });
    
    const recommendations = JSON.parse(recommendationsString);
    const parsed = BudgetingRecommendationsOutputSchema.parse(recommendations);
    return parsed;
  } catch (e) {
    console.error(e);
    return { error: "Failed to get budgeting recommendations." };
  }
}
