"use server";

import { budgetingRecommendations, type BudgetingRecommendationsOutput } from "@/ai/flows/budgeting-recommendations";
import { placeholderTransactions, placeholderGoals } from "@/lib/placeholder-data";

export async function getBudgetingRecommendations(): Promise<BudgetingRecommendationsOutput | { error: string }> {
  try {
    const income = placeholderTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = placeholderTransactions
      .filter(t => t.type === 'expense')
      .map(t => ({ category: t.category, amount: t.amount }));

    const financialGoals = placeholderGoals.map(g => `${g.name} ($${g.targetAmount})`);

    const recommendations = await budgetingRecommendations({
      income,
      expenses,
      financialGoals,
    });
    return recommendations;
  } catch (e) {
    console.error(e);
    return { error: "Failed to get budgeting recommendations." };
  }
}
