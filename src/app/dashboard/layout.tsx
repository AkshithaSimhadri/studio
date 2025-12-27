import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { PanelLeft } from "lucide-react";
import Link from "next/link";
import { Landmark } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
              <div className="md:hidden">
                <SidebarTrigger asChild>
                  <Button variant="outline" size="icon">
                    <PanelLeft className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SidebarTrigger>
              </div>
              <div className="flex-1">
                {/* Header content can go here, e.g., search bar */}
              </div>
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8 bg-secondary/50">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
