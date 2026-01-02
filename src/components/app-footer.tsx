
'use client';

import Link from 'next/link';
import { Landmark, Twitter, Github, Linkedin } from 'lucide-react';

export function AppFooter() {
  return (
    <footer className="w-full mt-auto py-6 px-4 md:px-6 border-t bg-footer text-primary-foreground">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Landmark className="h-6 w-6 text-primary-foreground" />
          <span className="font-bold font-headline">FinanceWise AI</span>
        </div>
        <p className="text-sm text-primary-foreground/80">
          © {new Date().getFullYear()} FinanceWise AI. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground">
            <Twitter className="h-5 w-5" />
            <span className="sr-only">Twitter</span>
          </Link>
          <Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground">
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground">
            <Linkedin className="h-5 w-5" />
            <span className="sr-only">LinkedIn</span>
          </Link>
        </div>
      </div>
       <div className="container mx-auto text-center md:text-right text-sm text-primary-foreground/80 mt-4">
            <Link href="#" className="hover:underline hover:text-primary-foreground">Privacy Policy</Link>
            <span className="mx-2">|</span>
            <Link href="#" className="hover:underline hover:text-primary-foreground">Terms of Service</Link>
        </div>
    </footer>
  );
}
