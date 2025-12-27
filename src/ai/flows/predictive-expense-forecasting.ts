'use server';

/**
 * @fileOverview Provides predictive expense and savings forecasting based on user's historical data.
 *
 * - predictiveExpenseForecasting - A function that handles the expense forecasting process.
 * - PredictiveExpenseForecastingInput - The input type for the predictiveExpenseForecasting function.
 * - PredictiveExpenseForecastingOutput - The return type for the predictiveExpenseForecasting function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictiveExpenseForecastingInputSchema = z.object({
  historicalData: z
    .string()
    .describe(
      'Historical financial data of the user including income and expenses, as a JSON string.'
    ),
  savingsGoals: z
    .string()
    .optional()
    .describe(
      'Optional savings goals of the user, as a JSON string.'
    ),
  investmentStrategies: z
    .string()
    .optional()
    .describe(
      'Optional investment strategies for what-if scenarios, as a JSON string.'
    ),
});
export type PredictiveExpenseForecastingInput = z.infer<
  typeof PredictiveExpenseForecastingInputSchema
>;

const PredictiveExpenseForecastingOutputSchema = z.object({
  forecastedExpenses: z
    .string()
    .describe('Forecasted future expenses, as a JSON string.'),
  forecastedSavings: z
    .string()
    .describe('Forecasted future savings, as a JSON string.'),
  insights: z
    .string()
    .describe('Insights and recommendations based on the forecast.'),
});
export type PredictiveExpenseForecastingOutput = z.infer<
  typeof PredictiveExpenseForecastingOutputSchema
>;

export async function predictiveExpenseForecasting(
  input: PredictiveExpenseForecastingInput
): Promise<PredictiveExpenseForecastingOutput> {
  return predictiveExpenseForecastingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictiveExpenseForecastingPrompt',
  input: {schema: PredictiveExpenseForecastingInputSchema},
  output: {schema: PredictiveExpenseForecastingOutputSchema},
  prompt: `You are an AI-powered personal finance advisor. Analyze the user's historical financial data, savings goals, and investment strategies to forecast future expenses and savings.

  Historical Data: {{{historicalData}}}
  Savings Goals: {{{savingsGoals}}}
  Investment Strategies: {{{investmentStrategies}}}

  Provide a detailed forecast of future expenses and savings, along with actionable insights and recommendations to help the user achieve their financial goals. Consider different \"what-if\" scenarios based on various savings and investment strategies.

  Ensure that the forecasted expenses and savings are realistic and aligned with the user's financial situation. Present the results in a clear and concise manner.
  Return the forecasted expenses, forecasted savings, and insights as JSON strings.
  `,
});

const predictiveExpenseForecastingFlow = ai.defineFlow(
  {
    name: 'predictiveExpenseForecastingFlow',
    inputSchema: PredictiveExpenseForecastingInputSchema,
    outputSchema: PredictiveExpenseForecastingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
