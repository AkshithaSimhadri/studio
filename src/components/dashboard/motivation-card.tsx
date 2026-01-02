'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit } from 'lucide-react';
import { motivationalQuotes } from '@/lib/motivations';

export function MotivationCard() {
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(
    null
  );

  useEffect(() => {
    // Select a quote based on the day of the year to ensure it's the same for the whole day
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const quoteIndex = dayOfYear % motivationalQuotes.length;
    setQuote(motivationalQuotes[quoteIndex]);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="text-primary" /> Daily Motivation
        </CardTitle>
      </CardHeader>
      <CardContent>
        {quote ? (
          <figure>
            <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
              "{quote.text}"
            </blockquote>
            <figcaption className="mt-2 text-right text-sm font-semibold">
              - {quote.author}
            </figcaption>
          </figure>
        ) : (
          <p>Loading your daily dose of motivation...</p>
        )}
      </CardContent>
    </Card>
  );
}
