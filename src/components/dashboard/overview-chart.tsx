
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Expense, Income } from "@/lib/types";
import { useMemo } from "react";
import { Skeleton } from "../ui/skeleton";
import { format } from 'date-fns';

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
        const transactionDate = new Date(t.date);
        const monthKey = format(transactionDate, 'MMM yyyy');

        if (!dataByMonth[monthKey]) {
          dataByMonth[monthKey] = { income: 0, expenses: 0 };
        }
        dataByMonth[monthKey][type] += t.amount;
      });
    };

    processTransactions(incomes, 'income');
    processTransactions(expenses, 'expense');

    const sortedMonthKeys = Object.keys(dataByMonth).sort((a, b) => {
        return new Date(a).getTime() - new Date(b).getTime();
    });

    // Get the last 6 months from the sorted keys
    const last6MonthKeys = sortedMonthKeys.slice(-6);

    const finalChartData = last6MonthKeys.map(key => ({
      month: key.split(' ')[0], // just the 'MMM' part
      ...dataByMonth[key]
    }));

    // If there are fewer than 6 months of data, fill with empty months
    if (finalChartData.length < 6) {
        const today = new Date();
        const pastMonths: {month: string, income: number, expenses: number}[] = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(today.getMonth() - i);
            const monthKey = format(d, 'MMM yyyy');
            const monthLabel = format(d, 'MMM');

            if (!dataByMonth[monthKey]) {
                pastMonths.push({ month: monthLabel, income: 0, expenses: 0 });
            } else {
                pastMonths.push({ month: monthLabel, ...dataByMonth[monthKey]});
            }
        }
        const uniqueMonths = [...new Map(pastMonths.map(item => [item.month, item])).values()];
        return uniqueMonths.slice(-6);
    }
    
    return finalChartData;

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
