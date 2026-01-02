
import { AppFooter } from "@/components/app-footer";
import { Landmark } from "lucide-react";
import Link from "next/link";
import { Button } from '@/components/ui/button';


export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
       <header className="px-4 lg:px-6 h-14 flex items-center bg-background border-b">
        <Link href="/" className="flex items-center justify-center">
          <Landmark className="h-6 w-6 text-primary" />
          <span className="sr-only">FinanceWise AI</span>
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
            <Link href="/dashboard">
              Dashboard
            </Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">About FinanceWise AI</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  FinanceWise AI is your intelligent partner for smart budgeting, insightful financial analysis, and personalized guidance. Our mission is to empower you to take control of your finances and achieve your dreams.
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
