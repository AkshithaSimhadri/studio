"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const chartData = [
  { month: "Jan", income: 186, expenses: 80 },
  { month: "Feb", income: 305, expenses: 200 },
  { month: "Mar", income: 237, expenses: 120 },
  { month: "Apr", income: 73, expenses: 190 },
  { month: "May", income: 209, expenses: 130 },
  { month: "Jun", income: 214, expenses: 140 },
]

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

export function OverviewChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
        <CardDescription>Your income and expenses for the last 6 months.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                 <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                    cursor={{ fill: 'hsl(var(--muted))' }}
                    content={<ChartTooltipContent />}
                />
                <Legend />
                <Bar dataKey="income" fill={chartConfig.income.color} name="Income" radius={4} />
                <Bar dataKey="expenses" fill={chartConfig.expenses.color} name="Expenses" radius={4} />
            </BarChart>
            </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
