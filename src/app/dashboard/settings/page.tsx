'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { updateProfile } from "firebase/auth";
import { type UserProfile } from "@/lib/types";

export default function SettingsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, "users", user.uid) : null),
    [user, firestore]
  );
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userDocRef);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const [theme, setTheme] = useState("light");
  const [currency, setCurrency] = useState("usd");

  useEffect(() => {
    if (userProfile) {
      setFirstName(userProfile.firstName);
      setLastName(userProfile.lastName);
    }
  }, [userProfile]);

  const handleSaveProfile = async () => {
    if (!user || !userDocRef) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "You must be logged in to save your profile.",
        });
        return;
    }
    setIsSaving(true);
    try {
        const updatedProfile = {
            firstName,
            lastName,
        };
        // Update Firestore document
        await setDoc(userDocRef, updatedProfile, { merge: true });

        // Update Firebase Auth profile
        await updateProfile(user, {
            displayName: `${firstName} ${lastName}`.trim(),
        });

        toast({
            title: "Profile Saved",
            description: "Your profile information has been updated.",
        });
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: error.message || "Could not save profile.",
        });
    } finally {
        setIsSaving(false);
    }
  };
  
  const handleSavePreferences = () => {
    toast({
      title: "Preferences Saved",
      description: "Your preferences have been updated.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and app preferences.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              This is how others will see you on the site.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isProfileLoading ? (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
            ) : (
                <>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={user?.email || ''} readOnly disabled />
                </div>
                </>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveProfile} disabled={isProfileLoading || isSaving}>
              {isSaving ? 'Saving...' : 'Save Profile'}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>
              Customize the look and feel of your application.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select value={theme} onValueChange={(value) => setTheme(value)}>
                <SelectTrigger id="theme">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={currency} onValueChange={(value) => setCurrency(value)}>
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD (United States Dollar)</SelectItem>
                  <SelectItem value="eur">EUR (Euro)</SelectItem>
                  <SelectItem value="gbp">GBP (British Pound)</SelectItem>
                  <SelectItem value="inr">INR (Indian Rupee)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSavePreferences}>Save Preferences</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}