'use server';

/**
 * @fileOverview Provides personalized financial guidance, including loan, business, and investment suggestions,
 *               along with risk and return explanations.
 *
 * - getFinancialGuidance - A function that generates personalized financial advice.
 * - FinancialGuidanceInput - The input type for the getFinancialGuidance function.
 * - FinancialGuidanceOutput - The return type for the getFinancialGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FinancialGuidanceInputSchema = z.object({
  financialSituation: z
    .string()
    .describe(
      'A detailed description of the user\'s current financial situation, including income, expenses, debts, and assets.'
    ),
  goals: z
    .string()
    .describe(
      'The user\'s financial goals, such as saving for retirement, buying a house, or starting a business.'
    ),
  interests: z
    .string()
    .describe(
      'The user\'s interests related to loans, business strategies, and investment ideas.'
    ),
});
export type FinancialGuidanceInput = z.infer<typeof FinancialGuidanceInputSchema>;

const FinancialGuidanceOutputSchema = z.object({
  loanSuggestions: z
    .array(z.string())
    .describe('Tailored suggestions for loans based on the user\'s financial situation and interests.'),
  businessStrategies:
    z.array(z.string()).describe('Relevant business strategies for the user.'),
  investmentIdeas:
    z.array(z.string()).describe('Personalized investment ideas for the user.'),
  riskAndReturnsExplanations:
    z
      .string()
      .describe(
        'Detailed explanations of the risks and returns associated with each loan, business strategy, and investment idea.'
      ),
});
export type FinancialGuidanceOutput = z.infer<typeof FinancialGuidanceOutputSchema>;

export async function getFinancialGuidance(
  input: FinancialGuidanceInput
): Promise<FinancialGuidanceOutput> {
  return financialGuidanceFlow(input);
}

const financialGuidancePrompt = ai.definePrompt({
  name: 'financialGuidancePrompt',
  input: {schema: FinancialGuidanceInputSchema},
  output: {schema: FinancialGuidanceOutputSchema},
  prompt: `You are an AI-powered financial advisor providing personalized guidance to users.

  Based on the user's financial situation, goals, and interests, offer tailored suggestions for loans, business strategies, and investment ideas.
  Provide clear explanations of the risks and potential returns associated with each option.

  Financial Situation: {{{financialSituation}}}
  Goals: {{{goals}}}
  Interests: {{{interests}}}

  Consider all factors carefully and provide well-reasoned and practical advice.
  Format the output to align with the schema descriptions. Do not provide any introductory or concluding remarks, simply present the requested suggestions and explanations.
  `,
});

const financialGuidanceFlow = ai.defineFlow(
  {
    name: 'financialGuidanceFlow',
    inputSchema: FinancialGuidanceInputSchema,
    outputSchema: FinancialGuidanceOutputSchema,
  },
  async input => {
    const {output} = await financialGuidancePrompt(input);
    return output!;
  }
);
