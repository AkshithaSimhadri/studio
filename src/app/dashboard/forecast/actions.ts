"use server";

import { predictiveExpenseForecasting, type PredictiveExpenseForecastingOutput } from "@/ai/flows/predictive-expense-forecasting";
import { historicalDataForAI, placeholderGoals } from "@/lib/placeholder-data";

export async function getExpenseForecast(investmentStrategies?: string): Promise<PredictiveExpenseForecastingOutput | { error: string }> {
  try {
    const forecast = await predictiveExpenseForecasting({
      historicalData: JSON.stringify(historicalDataForAI),
      savingsGoals: JSON.stringify(placeholderGoals),
      investmentStrategies: investmentStrategies || "Standard savings growth of 2% annually.",
    });
    return forecast;
  } catch (e) {
    console.error(e);
    return { error: "Failed to get expense forecast." };
  }
}
