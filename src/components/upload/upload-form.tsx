
"use client";

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UploadCloud } from 'lucide-react';
import type { ExtractedTransaction } from '@/ai/flows/extract-transactions-from-pdf';

type UploadFormProps = {
  onUploadSuccess: (transactions: ExtractedTransaction[]) => void;
};

const readFileAsDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsText(file);
    });
};

export function UploadForm({ onUploadSuccess }: UploadFormProps) {
  const { register, handleSubmit, watch } = useForm<{ file: FileList }>();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const watchedFile = watch("file");

  const onSubmit: SubmitHandler<{ file: FileList }> = async (data) => {
    const file = data.file[0];
    if (!file) {
      toast({ variant: 'destructive', title: 'No file selected', description: 'Please choose a PDF or CSV file to upload.' });
      return;
    }

    setLoading(true);
    try {
        let fileContent: string;
        let body;

        if (file.type === 'application/pdf') {
            fileContent = await readFileAsDataURI(file);
            body = { fileDataUri: fileContent, fileType: 'pdf' };
        } else if (file.type === 'text/csv') {
            fileContent = await readFileAsText(file);
            body = { fileContent: fileContent, fileType: 'csv' };
        } else {
            throw new Error('Unsupported file type. Please upload a PDF or CSV.');
        }
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to process file.');
      }
      
      onUploadSuccess(result.transactions);
      toast({ title: 'Upload Successful', description: `${result.transactions.length} transactions were extracted from your file.` });

    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Upload Failed', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Transaction File</CardTitle>
        <CardDescription>Select a PDF or CSV file containing your transaction history to be analyzed by AI.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="file-upload">Transaction Document</Label>
            <Input id="file-upload" type="file" accept=".pdf,.csv" {...register('file', { required: true })} />
          </div>
          <Button type="submit" disabled={loading || !watchedFile || watchedFile.length === 0}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <UploadCloud className="mr-2 h-4 w-4" />
                Upload and Analyze
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
