


// Base type for a transaction-like object
interface TransactionLike {
  id: string;
  userId: string;
  date: string;
  amount: number;
  category: Category;
}

export interface Expense extends TransactionLike {
  description: string;
}

export interface Income extends TransactionLike {
  source: string;
}

// A more generic transaction type for UI components
export type Transaction = {
  id: string;
  date: string;
  description: string; // `source` from Income will be mapped to this
  amount: number;
  type: 'income' | 'expense';
  category: Category;
};


export type FinancialGoal = {
  id: string;
  userId: string;
  name: string;
  targetAmount: number; // The total amount for the goal.
  currentAmount: number; // The amount currently saved towards the goal.
  targetDate: string;
};

export type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  registrationDate: string;
};

export const categories = [
  'Food',
  'Transport',
  'Shopping',
  'Bills & Utilities',
  'Entertainment',
  'Health',
  'Education',
  'Travel',
  'Groceries',
  'Salary',
  'Investments',
  'Rent',
  'Other',
] as const;

export type Category = (typeof categories)[number];

import { z } from 'zod';

export const ExtractedTransactionSchema = z.object({
    date: z.string().describe("The date of the transaction in 'YYYY-MM-DD' format."),
    description: z.string().describe("A brief description of the transaction."),
    amount: z.number().describe("The transaction amount as a positive number."),
    type: z.enum(['income', 'expense']).describe("The type of transaction."),
    category: z.enum(categories).describe("The most likely category for the transaction."),
});

export type ExtractedTransaction = z.infer<typeof ExtractedTransactionSchema>;

export interface UploadHistoryItem {
  id: string;
  userId: string;
  fileName: string;
  uploadDate: string;
  fileType: 'pdf' | 'csv';
  transactionCount: number;
  transactions: ExtractedTransaction[];
}

    