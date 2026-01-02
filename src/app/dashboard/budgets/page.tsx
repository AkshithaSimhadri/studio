
import { BudgetingForm } from "@/components/budgets/budgeting-form";

export default function BudgetsPage() {
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-fuchsia-500 bg-[length:200%_200%] animate-gradient-shift">Budget Planner</h1>
        <p className="text-muted-foreground">
          Generate a budget plan based on your financial habits.
        </p>
      </div>
      <BudgetingForm />
    </div>
  );
}
