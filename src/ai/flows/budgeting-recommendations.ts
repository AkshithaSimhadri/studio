'use server';

/**
 * @fileOverview AI-Powered Budgeting Recommendations flow.
 *
 * This file defines a Genkit flow that analyzes a user's spending patterns and income
 * to provide personalized budget recommendations.
 *
 * @exports budgetingRecommendations - The main function to generate budgeting recommendations.
 * @exports BudgetingRecommendationsInput - The input type for the budgetingRecommendations function.
 * @exports BudgetingRecommendationsOutput - The output type for the budgetingRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BudgetingRecommendationsInputSchema = z.object({
  income: z.number().describe('The user’s monthly income.'),
  expenses: z
    .array(z.object({
      category: z.string().describe('The category of the expense.'),
      amount: z.number().describe('The amount spent in that category.'),
    }))
    .describe('An array of the user’s expenses.'),
  financialGoals: z
    .array(z.string())
    .describe('An array of the user’s financial goals.'),
});
export type BudgetingRecommendationsInput = z.infer<
  typeof BudgetingRecommendationsInputSchema
>;

const BudgetingRecommendationsOutputSchema = z.object({
  budgetRecommendations: z
    .array(z.object({
      category: z.string().describe('The category to budget for.'),
      recommendedAmount: z.number().describe('The recommended budget amount.'),
      rationale: z
        .string()
        .describe('The rationale behind the recommended amount.'),
    }))
    .describe('An array of budget recommendations.'),
  savingsTips: z
    .array(z.string())
    .describe('Personalized tips to improve savings.'),
});
export type BudgetingRecommendationsOutput = z.infer<
  typeof BudgetingRecommendationsOutputSchema
>;

export async function budgetingRecommendations(
  input: BudgetingRecommendationsInput
): Promise<BudgetingRecommendationsOutput> {
  return budgetingRecommendationsFlow(input);
}

const budgetingRecommendationsPrompt = ai.definePrompt({
  name: 'budgetingRecommendationsPrompt',
  input: {schema: BudgetingRecommendationsInputSchema},
  output: {schema: BudgetingRecommendationsOutputSchema},
  prompt: `You are an AI-powered personal finance advisor. Analyze the user's income, expenses, and financial goals to provide personalized budget recommendations and savings tips.

  User's financial data:
  - Monthly Income: {{{income}}}
  - Expenses:
  {{#each expenses}}
    - {{{category}}}: {{{amount}}}
  {{/each}}
  - Financial Goals: {{#each financialGoals}}{{{this}}}{{/each}}

  Generate budget recommendations and savings tips based on this data.
  `,
});

const budgetingRecommendationsFlow = ai.defineFlow(
  {
    name: 'budgetingRecommendationsFlow',
    inputSchema: BudgetingRecommendationsInputSchema,
    outputSchema: BudgetingRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await budgetingRecommendationsPrompt(input);
    return output!;
  }
);
