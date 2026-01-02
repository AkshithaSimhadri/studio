"use server";

import { budgetingRecommendations } from "@/ai/flows/budgeting-recommendations";
import { 
  type FullBudgetingRecommendationsOutput,
  type BudgetingRecommendationsOutput
} from "@/ai/flows/budgeting-recommendations.types";
import type { Category, Expense, Income } from "@/lib/types";
import { initializeAdminApp } from "@/firebase/admin";
import { getAuth } from "firebase-admin/auth";
import { headers } from "next/headers";

// Categorize expenses into Needs, Wants, and Savings/Other
const needsCategories: Category[] = ["Groceries", "Bills & Utilities", "Transport", "Health", "Rent"];
const wantsCategories: Category[] = ["Food", "Shopping", "Entertainment", "Travel"];

const defaultSavingsTips = [
  "Create a detailed monthly budget and stick to it.",
  "Review your subscriptions and cancel any you don't use.",
  "Try cooking more meals at home instead of eating out.",
  "Set up automatic transfers to your savings account each payday.",
];

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

    const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);

    const expenseSummary = expenses.map(t => ({ category: t.category, amount: t.amount }));

    // 1. Get savings tips from AI (creative task)
    let aiResult: BudgetingRecommendationsOutput | null = null;
    try {
        if (totalIncome > 0 && expenseSummary.length > 0) {
            aiResult = await budgetingRecommendations({
                income: totalIncome,
                expenses: expenseSummary,
            });
        }
    } catch (aiError) {
        console.error("AI budgetingRecommendations flow failed:", aiError);
        // Don't surface the error to the user, just use default tips.
    }
    
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
      savingsTips: aiResult?.savingsTips ?? defaultSavingsTips,
    };
    
    return finalOutput;

  } catch (e: any) {
    console.error("Error in getBudgetingRecommendations:", e);
    if (e.message === 'Unauthorized') {
        return { error: "Authentication error. Please log in again." };
    }
    return { error: "Failed to get budgeting recommendations." };
  }
}
