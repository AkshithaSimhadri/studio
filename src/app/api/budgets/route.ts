
import { getBudgetingRecommendations } from "@/app/dashboard/budgets/actions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const result = await getBudgetingRecommendations();
        if ('error' in result) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }
        return NextResponse.json(result);
    } catch (e: any) {
        return NextResponse.json({ error: e.message || 'An unexpected error occurred.' }, { status: 500 });
    }
}
