"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AreaChart, Loader2, BarChart } from "lucide-react";
import { getExpenseForecast } from "@/app/dashboard/forecast/actions";
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { ChartTooltipContent } from "@/components/ui/chart";

type ForecastData = {
    forecastedExpenses: { month: string; amount: number }[];
    forecastedSavings: { month: string; amount: number }[];
    insights: string;
};

export function ForecastingForm() {
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [investmentStrategy, setInvestmentStrategy] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setForecast(null);
    const result = await getExpenseForecast(investmentStrategy);
    if ("error" in result) {
      setError(result.error);
    } else {
        try {
            setForecast({
                forecastedExpenses: JSON.parse(result.forecastedExpenses),
                forecastedSavings: JSON.parse(result.forecastedSavings),
                insights: result.insights,
            });
        } catch(e) {
            setError("Failed to parse forecast data from AI response.");
        }
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Predictive Financial Forecasting</CardTitle>
          <CardDescription>
            See into your financial future. Use our AI to forecast your expenses and savings.
            Try a 'what-if' scenario by describing a potential investment strategy.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid gap-2">
                <Label htmlFor="investment-strategy">What-if Scenario (Optional)</Label>
                <Textarea
                    id="investment-strategy"
                    placeholder="e.g., What if I invest $500 monthly in an index fund with an average 7% annual return?"
                    value={investmentStrategy}
                    onChange={(e) => setInvestmentStrategy(e.target.value)}
                />
            </div>
            <Button onClick={handleSubmit} disabled={loading}>
                {loading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Forecasting...
                </>
                ) : (
                <>
                    <AreaChart className="mr-2 h-4 w-4" />
                    Forecast My Finances
                </>
                )}
            </Button>        
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive">
          <CardHeader><CardTitle className="text-destructive">An Error Occurred</CardTitle></CardHeader>
          <CardContent><p>{error}</p></CardContent>
        </Card>
      )}

      {forecast && (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Forecasted Expenses & Savings</CardTitle>
                    <CardDescription>Based on your data and the provided scenario.</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart data={forecast.forecastedExpenses.map((exp, i) => ({ ...exp, savings: forecast.forecastedSavings[i].amount }))}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="month" tickLine={false} axisLine={false} />
                            <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                            <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
                            <Legend />
                            <Bar dataKey="amount" name="Expenses" fill="hsl(var(--chart-2))" radius={4} />
                            <Bar dataKey="savings" name="Savings" fill="hsl(var(--chart-1))" radius={4} />
                        </RechartsBarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>AI-Powered Insights</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="whitespace-pre-wrap">{forecast.insights}</p>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
