"use server";

import { predictiveExpenseForecasting, type PredictiveExpenseForecastingOutput } from "@/ai/flows/predictive-expense-forecasting";
import { initializeAdminApp } from "@/firebase/admin";
import type { Expense, FinancialGoal, Income } from "@/lib/types";
import { headers } from "next/headers";

async function getUserId() {
    const headersList = headers();
    const authorization = headersList.get('Authorization');
    if (!authorization?.startsWith('Bearer ')) {
        throw new Error('Unauthorized');
    }
    const idToken = authorization.split('Bearer ')[1];
    const { auth } = await initializeAdminApp();
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken.uid;
}

async function getUserData(userId: string) {
    const { firestore } = await initializeAdminApp();
    const incomesSnap = await firestore.collection(`users/${userId}/incomes`).get();
    const expensesSnap = await firestore.collection(`users/${userId}/expenses`).get();
    const goalsSnap = await firestore.collection(`users/${userId}/financial_goals`).get();
    
    const incomes = incomesSnap.docs.map(doc => doc.data() as Income);
    const expenses = expensesSnap.docs.map(doc => doc.data() as Expense);
    const goals = goalsSnap.docs.map(doc => doc.data() as FinancialGoal);

    return { incomes, expenses, goals };
}

export async function getExpenseForecast(investmentStrategies?: string): Promise<PredictiveExpenseForecastingOutput | { error: string }> {
  try {
    const userId = await getUserId();
    const { incomes, expenses, goals } = await getUserData(userId);

    const historicalData = {
        incomes,
        expenses
    };

    const forecast = await predictiveExpenseForecasting({
      historicalData: JSON.stringify(historicalData),
      savingsGoals: JSON.stringify(goals),
      investmentStrategies: investmentStrategies || "Standard savings growth of 2% annually.",
    });
    return forecast;
  } catch (e: any) {
    console.error("AI predictiveExpenseForecasting flow failed:", e);
    if (e.message === 'Unauthorized') {
        return { error: "Authentication error. Please log in again." };
    }
    return { error: `Failed to get expense forecast. ${e.message || ''}` };
  }
}
