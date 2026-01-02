
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
  targetAmount: number;
  currentAmount: number;
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
