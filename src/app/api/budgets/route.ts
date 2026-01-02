import { getBudgetingRecommendations } from "@/app/dashboard/budgets/actions";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(request: Request) {
    try {
        // We need to pass the headers to the server action
        const result = await getBudgetingRecommendations();
        if ('error' in result) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }
        return NextResponse.json(result);
    } catch (e: any) {
        return NextResponse.json({ error: e.message || 'An unexpected error occurred.' }, { status: 500 });
    }
}
