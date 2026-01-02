'use client';
import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Landmark } from "lucide-react";
import { useRouter } from 'next/navigation';
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import { PlaceHolderImages } from "@/lib/placeholder-images";
import { LoginForm } from "@/components/auth/login-form";
import { useAuth, useUser, useFirestore } from '@/firebase';

export default function LoginPage() {
  const authBgImage = PlaceHolderImages.find(
    (img) => img.id === "auth-background"
  );
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleEmailLogin = async (data: { email: string; password: string }) => {
    setIsSubmitting(true);
    await signInWithEmailAndPassword(auth, data.email, data.password);
    // Let the useEffect handle the redirect
    setIsSubmitting(false);
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Create user profile in Firestore if it doesn't exist
    const userRef = doc(firestore, 'users', user.uid);
    await setDoc(userRef, {
        id: user.uid,
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ')[1] || '',
        email: user.email,
        registrationDate: new Date().toISOString(),
    }, { merge: true });

    // Let the useEffect handle the redirect
    setIsSubmitting(false);
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12 bg-background/60 backdrop-blur-sm">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <Link href="/" className="flex items-center justify-center gap-2 text-primary-foreground mb-4">
                <Landmark className="h-8 w-8 text-primary" />
                <span className="text-3xl font-bold font-headline text-foreground">FinanceWise AI</span>
            </Link>
          </div>
          <LoginForm
            onEmailLogin={handleEmailLogin}
            onGoogleLogin={handleGoogleLogin}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative">
        {authBgImage && (
          <Image
            src={authBgImage.imageUrl}
            alt={authBgImage.description}
            fill
            className="h-full w-full object-cover"
            data-ai-hint={authBgImage.imageHint}
          />
        )}
         <div className="absolute inset-0 bg-gradient-to-br from-background/20 via-background/50 to-background/90"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="text-white bg-black/40 p-6 rounded-lg backdrop-blur-md">
                <h2 className="text-4xl font-bold">Take Control of Your Finances</h2>
                <p className="mt-2 text-lg">Your intelligent partner for smart budgeting and financial success.</p>
            </div>
        </div>
      </div>
    </div>
  );
}
