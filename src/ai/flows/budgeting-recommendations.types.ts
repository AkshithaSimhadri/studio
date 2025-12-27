import { z } from 'zod';

export const BudgetingRecommendationsInputSchema = z.object({
  income: z.number().describe('The user’s monthly income.'),
  expenses: z
    .array(
      z.object({
        category: z.string().describe('The category of the expense.'),
        amount: z.number().describe('The amount spent in that category.'),
      })
    )
    .describe('An array of the user’s expenses.'),
});
export type BudgetingRecommendationsInput = z.infer<
  typeof BudgetingRecommendationsInputSchema
>;

export const BudgetingRecommendationsOutputSchema = z.object({
  budgetRecommendations: z
    .array(
      z.object({
        category: z.string().describe('The category to budget for.'),
        recommendedAmount: z.number().describe('The recommended budget amount.'),
        rationale: z
          .string()
          .describe('The rationale behind the recommended amount.'),
      })
    )
    .describe('An array of budget recommendations.'),
  savingsTips: z
    .array(z.string())
    .describe('Personalized tips to improve savings.'),
});
export type BudgetingRecommendationsOutput = z.infer<
  typeof BudgetingRecommendationsOutputSchema
>;
