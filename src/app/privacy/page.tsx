
import { AppFooter } from "@/components/app-footer";
import { Landmark } from "lucide-react";
import Link from "next/link";
import { Button } from '@/components/ui/button';

export default function PrivacyPage() {
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
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Privacy Policy</h1>
              <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
              <div className="space-y-6 text-muted-foreground">
                <p>
                  Welcome to FinanceWise AI. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
                </p>
                <h2 className="text-2xl font-bold text-foreground">1. Information We Collect</h2>
                <p>
                  We may collect personal information that you provide to us directly, such as your name, email address, and financial data you upload or enter. We also collect anonymous data regarding your usage of the app to improve our services.
                </p>
                <h2 className="text-2xl font-bold text-foreground">2. How We Use Your Information</h2>
                <p>
                  We use the information we collect to operate and maintain our app, provide personalized financial guidance, communicate with you, and improve your user experience. Your financial data is used solely for providing you with the features of the app and is not shared with third parties for marketing purposes.
                </p>
                 <h2 className="text-2xl font-bold text-foreground">3. Data Security</h2>
                <p>
                  We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
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
