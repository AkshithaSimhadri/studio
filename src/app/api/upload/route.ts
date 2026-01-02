import { extractTransactionsFromPdf } from '@/ai/flows/extract-transactions-from-pdf';
import { extractTransactionsFromCsv } from '@/ai/flows/extract-transactions-from-csv';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fileType, fileDataUri, fileContent } = body;

    if (!fileType) {
        return NextResponse.json({ error: 'Missing fileType' }, { status: 400 });
    }
    
    let result;
    if (fileType === 'pdf') {
        if (!fileDataUri) {
            return NextResponse.json({ error: 'Missing fileDataUri for PDF' }, { status: 400 });
        }
        result = await extractTransactionsFromPdf({ pdfDataUri: fileDataUri });
    } else if (fileType === 'csv') {
        if (!fileContent) {
            return NextResponse.json({ error: 'Missing fileContent for CSV' }, { status: 400 });
        }
        result = await extractTransactionsFromCsv({ csvData: fileContent });
    } else {
        return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (e: any) {
    console.error('Error in /api/upload:', e);
    return NextResponse.json({ error: e.message || 'An unexpected error occurred during file processing.' }, { status: 500 });
  }
}
