'use server';

/**
 * @fileOverview AI-Powered Budgeting Recommendations flow.
 *
 * This file defines a Genkit flow that analyzes a user's spending patterns and income
 * to provide personalized budget recommendations.
 *
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  BudgetingRecommendationsInputSchema,
  type BudgetingRecommendationsInput,
  BudgetingRecommendationsOutputSchema,
  type BudgetingRecommendationsOutput,
} from './budgeting-recommendations.types';

export async function budgetingRecommendations(
  input: BudgetingRecommendationsInput
): Promise<BudgetingRecommendationsOutput> {
  return budgetingRecommendationsFlow(input);
}

const budgetingRecommendationsPrompt = ai.definePrompt({
  name: 'budgetingRecommendationsPrompt',
  input: { schema: BudgetingRecommendationsInputSchema },
  output: { schema: BudgetingRecommendationsOutputSchema },
  prompt: `You are an expert financial advisor. Generate personalized budget recommendations and actionable savings tips based on the user's income and expenses.

  User Data:
  - Monthly Income: {{{income}}}
  - Expenses:
  {{#each expenses}}
    - {{category}}: {{{amount}}}
  {{/each}}
  `,
});

const budgetingRecommendationsFlow = ai.defineFlow(
  {
    name: 'budgetingRecommendationsFlow',
    inputSchema: BudgetingRecommendationsInputSchema,
    outputSchema: BudgetingRecommendationsOutputSchema,
  },
  async (input) => {
    const { output } = await budgetingRecommendationsPrompt(input);
    return output!;
  }
);
