import { extractTransactionsFromPdf, type ExtractTransactionsInput } from '@/ai/flows/extract-transactions-from-pdf';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body: ExtractTransactionsInput = await request.json();
    if (!body.pdfDataUri) {
      return NextResponse.json({ error: 'Missing pdfDataUri' }, { status: 400 });
    }
    const result = await extractTransactionsFromPdf(body);
    return NextResponse.json(result);
  } catch (e: any) {
    console.error('Error in /api/upload:', e);
    return NextResponse.json({ error: e.message || 'An unexpected error occurred during PDF processing.' }, { status: 500 });
  }
}
