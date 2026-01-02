'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Skeleton } from '@/components/ui/skeleton';
import { AppHeader } from '@/components/app-header';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
         <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
         </div>
      </div>
    );
  }

  return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <div className="flex flex-col flex-1 bg-secondary">
            <AppHeader />
            <main className="flex-1 p-4 md:p-6 lg:p-8">
               <div className="rounded-xl p-4 md:p-6 lg:p-8 -m-4 md:-m-6 lg:-m-8 bg-gradient-to-br from-pink-100 via-pink-50 to-pink-100 bg-[length:400%_400%] animate-subtle-shift dark:from-pink-900/30 dark:via-background dark:to-pink-900/30 h-full">
                {children}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
  );
}
