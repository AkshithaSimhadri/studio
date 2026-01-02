
"use server";

import {
  type FullBudgetingRecommendationsOutput,
} from "@/ai/flows/budgeting-recommendations.types";
import type { Category, Expense, Income } from "@/lib/types";
import { initializeAdminApp } from "@/firebase/admin";

const needsCategories: Category[] = ["Groceries", "Bills & Utilities", "Transport", "Health", "Rent"];
const wantsCategories: Category[] = ["Food", "Shopping", "Entertainment", "Travel"];

async function getUserIdFromToken(idToken: string) {
    if (!idToken) {
        throw new Error('Unauthorized');
    }
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


export async function getBudgetingRecommendations(idToken: string): Promise<FullBudgetingRecommendationsOutput | { error: string }> {
  try {
    const userId = await getUserIdFromToken(idToken);
    const { incomes, expenses } = await getUserData(userId);

    const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);

    if (totalIncome === 0) {
      return {
        budgetRecommendations: [],
        savingsTips: ["Start by adding some income to create a budget plan."]
      }
    }

    // Calculate budget recommendations in code (logical task)
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

    // Static, non-AI savings tips
    const savingsTips = [
        "Review your subscriptions and cancel any you don't use.",
        "Try cooking at home more often instead of eating out.",
        "Set up automatic transfers to a high-yield savings account.",
        "Look for generic brands for common household items.",
        "Use a programmable thermostat to save on energy bills."
    ];

    // 3. Combine results
    const finalOutput: FullBudgetingRecommendationsOutput = {
      budgetRecommendations,
      savingsTips,
    };
    
    return finalOutput;

  } catch (e: any) {
    console.error("Error in getBudgetingRecommendations:", e);
    if (e.code && (e.code.startsWith('auth/id-token-expired') || e.code.startsWith('auth/argument-error'))) {
        return { error: "Authentication error. Please log in again." };
    }
    return { error: "Failed to get budgeting recommendations." };
  }
}
