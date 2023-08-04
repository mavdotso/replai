'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SignIn from '@/lib/signin';

import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { KeyRound } from 'lucide-react';

export function RegisterForm({ className, ...props }) {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const router = useRouter();

    async function handleSignUp(e) {
        e.preventDefault();
        setIsLoading(true);
        setError(false);

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const user = await response.json();
                console.log('User registered:', user);

                const res = await SignIn(email, password);

                if (res.error) {
                    setIsLoading(false);
                    setError(true);
                } else {
                    setIsLoading(false);
                    router.push('/dashboard');
                }
            }
        } catch (error) {
            console.error('Error signing up:', error);
        }
    }

    return (
        <div className={cn('grid gap-6', className)} {...props}>
            <form onSubmit={handleSignUp}>
                <div className="grid gap-2">
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="email">
                            Email
                        </Label>
                        <Input
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            id="email"
                            placeholder="name@example.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading}
                        />
                        <Label className="sr-only" htmlFor="email">
                            Password
                        </Label>
                        <Input
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            id="password"
                            placeholder="Your strongest password"
                            type="password"
                            autoCorrect="off"
                            disabled={isLoading}
                        />
                    </div>
                    <Button disabled={isLoading}>{isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />} Create account</Button>
                </div>
            </form>
            {error && (
                <Alert variant="destructive">
                    <KeyRound className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>Login error. Please check your email and password and try again</AlertDescription>
                </Alert>
            )}
            {/* <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
            </div>
            <Button variant="outline" type="button" disabled={isLoading}>
                {isLoading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : <Icons.gitHub className="mr-2 h-4 w-4" />} Github
            </Button> */}
        </div>
    );
}
