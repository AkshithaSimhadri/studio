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

const saveBudgetRecommendations = ai.defineTool(
  {
    name: 'saveBudgetRecommendations',
    description: 'Saves the generated budget recommendations and savings tips.',
    inputSchema: BudgetingRecommendationsOutputSchema,
    outputSchema: z.void(),
  },
  async (input) => {
    // In a real app, you might save this to a database.
    // For now, we just use it to structure the AI's output.
  }
)

const budgetingRecommendationsFlow = ai.defineFlow(
  {
    name: 'budgetingRecommendationsFlow',
    inputSchema: BudgetingRecommendationsInputSchema,
    outputSchema: BudgetingRecommendationsOutputSchema,
  },
  async (input) => {
    const response = await ai.generate({
      prompt: `You are an expert financial advisor. Your goal is to help the user create a budget.
Analyze the user's income and expenses to generate personalized budget recommendations and actionable savings tips.
Call the \`saveBudgetRecommendations\` tool with the results.

- Monthly Income: ${input.income}
- Expenses:
${input.expenses.map(e => `  - ${e.category}: ${e.amount}`).join('\n')}
`,
      tools: [saveBudgetRecommendations],
      model: ai.getModel('googleai/gemini-2.5-flash'),
    });

    const toolRequest = response.toolRequest();
    if (!toolRequest || toolRequest.tool.name !== 'saveBudgetRecommendations') {
      throw new Error('Expected the model to call the saveBudgetRecommendations tool.');
    }
    
    return toolRequest.input;
  }
);
