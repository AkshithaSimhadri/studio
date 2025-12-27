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
} from './budgeting-recommendations.types';

export async function budgetingRecommendations(
  input: BudgetingRecommendationsInput
): Promise<string> {
  return budgetingRecommendationsFlow(input);
}

const budgetingRecommendationsPrompt = ai.definePrompt({
  name: 'budgetingRecommendationsPrompt',
  input: { schema: BudgetingRecommendationsInputSchema },
  output: { format: 'json' },
  prompt: `You are an expert financial advisor. Generate personalized budget recommendations and actionable savings tips based on the user's income and expenses. Return the response as a JSON object that conforms to this schema:
  
  ${JSON.stringify(BudgetingRecommendationsOutputSchema.jsonSchema, null, 2)}

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
    outputSchema: z.string(),
  },
  async (input) => {
    const { output } = await budgetingRecommendationsPrompt(input);
    return output!;
  }
);
