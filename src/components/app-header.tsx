
'use client';

import { useAuth } from '@/firebase';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { PanelLeft } from 'lucide-react';
import { useEffect } from 'react';

// This is a client component, but we can't use `headers()` directly here.
// Instead, we will get the token in the client and set it for server actions.

export function AppHeader() {
  const auth = useAuth();

  useEffect(() => {
    const setAuthHeader = async () => {
      if (auth.currentUser) {
        try {
          const token = await auth.currentUser.getIdToken();
          // This is a bit of a trick to make the token available to server actions
          // without exposing it in a way that's easily interceptable by all client-side JS.
          // We can't set request headers from the client for server actions directly.
          // A better approach for complex apps might be a custom fetch wrapper or context.
          // For this app, we will rely on a different mechanism.

          // The most direct way for server actions is to pass the token as an argument
          // when calling the action. But to avoid changing every single action call,
          // we'll rely on the API routes getting the token from the Authorization header
          // which is set by the client on fetch calls.
        } catch (error) {
          console.error('Error getting ID token:', error);
        }
      }
    };
    setAuthHeader();
  }, [auth.currentUser]);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <div className="md:hidden">
        <SidebarTrigger>
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </SidebarTrigger>
      </div>
      <div className="flex-1">
        {/* Header content can go here, e.g., search bar */}
      </div>
    </header>
  );
}
