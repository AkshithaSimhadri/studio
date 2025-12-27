import { TransactionsTable } from "@/components/transactions/transactions-table";
import { AddTransactionSheet } from "@/components/transactions/add-transaction-sheet";

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Transactions</h1>
          <p className="text-muted-foreground">
            View and manage your income and expenses.
          </p>
        </div>
        <AddTransactionSheet />
      </div>
      <TransactionsTable />
    </div>
  );
}
