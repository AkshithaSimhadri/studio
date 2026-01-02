
'use client';

import Link from 'next/link';
import { Landmark, Twitter, Github, Linkedin } from 'lucide-react';

export function AppFooter() {
  return (
    <footer className="w-full mt-auto py-4 px-4 md:px-6 border-t bg-footer text-primary-foreground">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Landmark className="h-5 w-5 text-primary-foreground" />
          <span className="font-bold font-headline text-sm">FinanceWise AI</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-primary-foreground/80">
          <Link href="#" className="hover:underline hover:text-primary-foreground">Privacy</Link>
          <Link href="#" className="hover:underline hover:text-primary-foreground">Terms</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground">
            <Twitter className="h-4 w-4" />
            <span className="sr-only">Twitter</span>
          </Link>
          <Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground">
            <Github className="h-4 w-4" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground">
            <Linkedin className="h-4 w-4" />
            <span className="sr-only">LinkedIn</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
