
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Expense, Income } from "@/lib/types";
import { useMemo } from "react";
import { Skeleton } from "../ui/skeleton";

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--chart-1))",
  },
  expenses: {
    label: "Expenses",
    color: "hsl(var(--chart-2))",
  },
}

type OverviewChartProps = {
  incomes: Income[];
  expenses: Expense[];
  isLoading: boolean;
};

export function OverviewChart({ incomes, expenses, isLoading }: OverviewChartProps) {

  const chartData = useMemo(() => {
    const dataByMonth: { [key: string]: { income: number; expenses: number } } = {};

    const processTransactions = (transactions: (Income | Expense)[], type: 'income' | 'expense') => {
      transactions.forEach(t => {
        const month = new Date(t.date).toLocaleString('default', { month: 'short' });
        if (!dataByMonth[month]) {
          dataByMonth[month] = { income: 0, expenses: 0 };
        }
        dataByMonth[month][type] += t.amount;
      });
    };

    processTransactions(incomes, 'income');
    processTransactions(expenses, 'expense');

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Get last 6 months
    const last6Months = Array.from({length: 6}, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        return months[d.getMonth()];
    }).reverse();

    return last6Months.map(month => ({
      month,
      income: dataByMonth[month]?.income || 0,
      expenses: dataByMonth[month]?.expenses || 0
    }));

  }, [incomes, expenses]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
        <CardDescription>Your income and expenses for the last 6 months.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                      dataKey="month"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                  />
                  <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip
                      cursor={{ fill: 'hsl(var(--muted))' }}
                      content={<ChartTooltipContent />}
                  />
                  <Legend />
                  <Bar dataKey="income" fill="var(--color-income)" name="Income" radius={4} />
                  <Bar dataKey="expenses" fill="var(--color-expenses)" name="Expenses" radius={4} />
              </BarChart>
              </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
