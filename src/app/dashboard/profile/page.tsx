
'use client';

import { ProfileForm } from '@/components/profile/profile-form';

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Profile Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings and personal information.
        </p>
      </div>
      <ProfileForm />
    </div>
  );
}
