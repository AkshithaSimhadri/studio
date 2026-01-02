
import { AppFooter } from "@/components/app-footer";
import { Landmark } from "lucide-react";
import Link from "next/link";
import { Button } from '@/components/ui/button';

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
       <header className="px-4 lg:px-6 h-14 flex items-center bg-background border-b">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Landmark className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">FinanceWise AI</span>
        </Link>
         <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/#features" className="text-sm font-medium hover:underline underline-offset-4">
            Features
          </Link>
          <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">
            About
          </Link>
           <Button asChild variant="outline">
            <Link href="/login">
              Login
            </Link>
          </Button>
           <Button asChild>
            <Link href="/login">
              Get Started
            </Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Terms of Service</h1>
               <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
               <div className="space-y-6 text-muted-foreground">
                <p>
                  Please read these Terms of Service carefully before using the FinanceWise AI application. Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms.
                </p>
                <h2 className="text-2xl font-bold text-foreground">1. Acceptance of Terms</h2>
                <p>
                 By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the service.
                </p>
                <h2 className="text-2xl font-bold text-foreground">2. Use of Service</h2>
                <p>
                  FinanceWise AI provides financial tools for informational purposes only. It is not intended to provide financial, legal, or tax advice. You are responsible for your own financial decisions.
                </p>
                 <h2 className="text-2xl font-bold text-foreground">3. Limitation of Liability</h2>
                <p>
                  In no event shall FinanceWise AI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <AppFooter />
    </div>
  );
}
