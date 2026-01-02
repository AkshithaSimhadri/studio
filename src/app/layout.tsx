import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from '@/firebase';
import { Inter as FontSans, Lexend as FontHeadline } from "next/font/google";
import { cn } from '@/lib/utils';

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontHeadline = FontHeadline({
  subsets: ["latin"],
  variable: "--font-headline",
});


export const metadata: Metadata = {
  title: 'FinanceWise AI',
  description: 'AI-Powered Personal Finance Manager',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(
          "font-sans antialiased",
          fontSans.variable,
          fontHeadline.variable
        )}>
        <FirebaseClientProvider>
          {children}
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
