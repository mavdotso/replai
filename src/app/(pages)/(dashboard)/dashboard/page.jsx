'use client';
import { Separator } from '@/components/ui/separator';
import { AccountForm } from '@/components/AccountForm';
import { signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function DashboardPage() {
    function handleSignout(e) {
        e.preventDefault;
        signOut();
    }
    const { data: session, status } = useSession({ required: true });

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Account</h3>
                <p className="text-sm text-muted-foreground">Update your account settings. Set your preferred language and timezone.</p>
            </div>
            <Separator />
            <AccountForm />
            <button onClick={handleSignout}>Sign out</button>
        </div>
    );
}
