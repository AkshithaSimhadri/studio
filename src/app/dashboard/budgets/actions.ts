"use server";

import {
  budgetingRecommendations,
  type BudgetingRecommendationsInput,
} from "@/ai/flows/budgeting-recommendations.ts";
import {
  type FullBudgetingRecommendationsOutput,
} from "@/ai/flows/budgeting-recommendations.types";
import type { Category, Expense, Income } from "@/lib/types";
import { initializeAdminApp } from "@/firebase/admin";
import { headers } from "next/headers";
import { getAuth } from "firebase-admin/auth";

// Categorize expenses into Needs, Wants, and Savings/Other
const needsCategories: Category[] = ["Groceries", "Bills & Utilities", "Transport", "Health", "Rent"];
const wantsCategories: Category[] = ["Food", "Shopping", "Entertainment", "Travel"];

async function getUserId() {
    const headersList = headers();
    const authorization = headersList.get('Authorization');
    if (!authorization?.startsWith('Bearer ')) {
        console.error("No authorization header found");
        throw new Error('Unauthorized');
    }
    const idToken = authorization.split('Bearer ')[1];
    const decodedToken = await getAuth().verifyIdToken(idToken);
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
    const { auth } = await initializeAdminApp();
    const headersList = headers();
    const authorization = headersList.get('Authorization');

    if (!authorization?.startsWith('Bearer ')) {
        throw new Error('Unauthorized');
    }
    const idToken = authorization.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const { incomes, expenses } = await getUserData(userId);

    const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);

    const expenseByCategory = expenses.reduce((acc, expense) => {
        if (!acc[expense.category]) {
            acc[expense.category] = 0;
        }
        acc[expense.category] += expense.amount;
        return acc;
    }, {} as Record<Category, number>);

    // Prepare input for AI
    const aiInput: BudgetingRecommendationsInput = {
      income: totalIncome,
      expenses: Object.entries(expenseByCategory).map(([category, amount]) => ({
        category: category,
        amount: amount,
      })),
    };

    // 1. Call AI for creative task (savings tips)
    const aiOutput = await budgetingRecommendations(aiInput);

    // 2. Calculate budget recommendations in code (logical task)
    const needsSpend = expenses
        .filter(e => needsCategories.includes(e.category))
        .reduce((sum, e) => sum + e.amount, 0);

    const wantsSpend = expenses
        .filter(e => wantsCategories.includes(e.category))
        .reduce((sum, e) => sum + e.amount, 0);

    // Apply 50/30/20 rule
    const needsTarget = totalIncome * 0.5;
    const wantsTarget = totalIncome * 0.3;
    const savingsTarget = totalIncome * 0.2;

    const budgetRecommendations = [
        {
            category: "Needs",
            recommendedAmount: needsTarget,
            rationale: `You are currently spending $${needsSpend.toFixed(2)}. The 50/30/20 rule suggests a target of $${needsTarget.toFixed(2)}.`
        },
        {
            category: "Wants",
            recommendedAmount: wantsTarget,
            rationale: `You are currently spending $${wantsSpend.toFixed(2)}. The 50/30/20 rule suggests a target of $${wantsTarget.toFixed(2)}.`
        },
        {
            category: "Savings",
            recommendedAmount: savingsTarget,
            rationale: `Based on the 50/30/20 rule, you should aim to save at least $${savingsTarget.toFixed(2)} per month.`
        }
    ];

    // 3. Combine results
    const finalOutput: FullBudgetingRecommendationsOutput = {
      budgetRecommendations,
      savingsTips: aiOutput.savingsTips,
    };
    
    return finalOutput;

  } catch (e: any) {
    console.error("Error in getBudgetingRecommendations:", e);
    if (e.code === 'auth/id-token-expired' || e.message === 'Unauthorized') {
        return { error: "Authentication error. Please log in again." };
    }
    return { error: "Failed to get budgeting recommendations." };
  }
}
