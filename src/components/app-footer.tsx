'use client';

import Link from 'next/link';
import { Landmark, Twitter, Github, Linkedin } from 'lucide-react';

export function AppFooter() {
  return (
    <footer className="w-full mt-auto py-6 px-4 md:px-6 border-t bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Landmark className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline">FinanceWise AI</span>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} FinanceWise AI. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link href="#" className="text-muted-foreground hover:text-foreground">
            <Twitter className="h-5 w-5" />
            <span className="sr-only">Twitter</span>
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-foreground">
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-foreground">
            <Linkedin className="h-5 w-5" />
            <span className="sr-only">LinkedIn</span>
          </Link>
        </div>
      </div>
       <div className="container mx-auto text-center md:text-right text-sm text-muted-foreground mt-4">
            <Link href="#" className="hover:underline">Privacy Policy</Link>
            <span className="mx-2">|</span>
            <Link href="#" className="hover:underline">Terms of Service</Link>
        </div>
    </footer>
  );
}
