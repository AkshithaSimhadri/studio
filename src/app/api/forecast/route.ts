import { getExpenseForecast } from "@/app/dashboard/forecast/actions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const investmentStrategies = body.investmentStrategies;
        const result = await getExpenseForecast(investmentStrategies);
        if ('error' in result) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }
        return NextResponse.json(result);
    } catch (e: any) {
        return NextResponse.json({ error: e.message || 'An unexpected error occurred.' }, { status: 500 });
    }
}
