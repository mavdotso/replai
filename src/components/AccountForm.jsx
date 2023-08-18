'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const accountFormSchema = z.object({
    email: z.string().email(),
});

export function AccountForm() {
    const [email, setEmail] = useState('');

    const { data: session, status, update } = useSession();

    useEffect(() => {
        setEmail(session?.user?.email);
    }, [status]);

    const form = useForm({
        resolver: zodResolver(accountFormSchema),
        email: '',
    });

    async function onSubmit(values) {
        try {
            const response = await fetch('/api/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, values }),
            });

            if (response) {
                // Generate and slugify a verification token
                // TODO: Generate a token
                // TODO: Send a verification email

                //FIXME: This doesn't work

                update({
                    ...session,
                    user: {
                        ...session?.user,
                        email: values.email,
                    },
                });
            }
        } catch (error) {
            throw new Error('Error');
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder={email} {...field} />
                            </FormControl>
                            <FormDescription>This is the email that you are using to access @replai.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Update account</Button>
            </form>
        </Form>
    );
}
