
"use server";

import { budgetingRecommendations } from "@/ai/flows/budgeting-recommendations";
import { initializeAdminApp } from "@/firebase/admin";
import type { Expense, Income } from "@/lib/types";
import { headers } from "next/headers";
import type { FullBudgetingRecommendationsOutput } from "@/ai/flows/budgeting-recommendations.types";

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
    
    const incomes = incomesSnap.docs.map(doc => doc.data() as Income);
    const expenses = expensesSnap.docs.map(doc => doc.data() as Expense);

    return { incomes, expenses };
}

export async function getBudgetingRecommendations(): Promise<FullBudgetingRecommendationsOutput | { error: string }> {
  try {
    const userId = await getUserId();
    const { incomes, expenses } = await getUserData(userId);

    const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);

    if (totalIncome === 0) {
      return {
        budgetRecommendations: [],
        savingsTips: ["Please add your income sources to generate a budget plan."]
      };
    }
    
    const expenseByCategory = expenses.reduce((acc, expense) => {
        if (!acc[expense.category]) {
            acc[expense.category] = 0;
        }
        acc[expense.category] += expense.amount;
        return acc;
    }, {} as Record<string, number>);

    const aiInput = {
        income: totalIncome,
        expenses: Object.entries(expenseByCategory).map(([category, amount]) => ({
            category,
            amount,
        })),
    };

    const aiResult = await budgetingRecommendations(aiInput);

    const needsSpend = expenses
        .filter(e => ["Groceries", "Bills & Utilities", "Transport", "Health", "Rent"].includes(e.category))
        .reduce((sum, e) => sum + e.amount, 0);

    const wantsSpend = expenses
        .filter(e => ["Food", "Shopping", "Entertainment", "Travel"].includes(e.category))
        .reduce((sum, e) => sum + e.amount, 0);

    const needsTarget = totalIncome * 0.5;
    const wantsTarget = totalIncome * 0.3;
    const savingsTarget = totalIncome * 0.2;

    const budgetRecommendations = [
        {
            category: "Needs",
            recommendedAmount: needsTarget,
            rationale: `You're currently spending $${needsSpend.toFixed(2)}. The 50/30/20 rule suggests a target of $${needsTarget.toFixed(2)}.`
        },
        {
            category: "Wants",
            recommendedAmount: wantsTarget,
            rationale: `You're currently spending $${wantsSpend.toFixed(2)}. The 50/30/20 rule suggests a target of $${wantsTarget.toFixed(2)}.`
        },
        {
            category: "Savings",
            recommendedAmount: savingsTarget,
            rationale: `Based on your income, you should aim to save at least $${savingsTarget.toFixed(2)} per month.`
        }
    ];

    return {
        budgetRecommendations,
        savingsTips: aiResult.savingsTips,
    };
    
  } catch (e: any) {
    console.error("AI budgetingRecommendations flow failed:", e);
    if (e.message === 'Unauthorized') {
        return { error: "Authentication error. Please log in again." };
    }
    return { error: `Failed to get budgeting recommendations. ${e.message || ''}` };
  }
}
