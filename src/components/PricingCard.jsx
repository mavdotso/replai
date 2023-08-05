import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserSession } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { redirect } from 'next/navigation';

export function PricingCard(props) {
    const metadata = props.pricingKey;
    const features = Object.values(metadata);

    async function createCheckoutSession(data) {
        'use server';
        const { user } = await getUserSession();

        const existingUser = await prismadb.user.findUnique({
            where: { email: user.email },
        });

        const lookup = await data.get('lookup_key');

        const prices = await stripe.prices.list({
            lookup_keys: [lookup],
            expand: ['data.product'],
        });

        const session = await stripe.checkout.sessions.create({
            billing_address_collection: 'auto',
            line_items: [
                {
                    price: prices.data[0].id,
                    quantity: 1,
                },
            ],
            subscription_data: {
                metadata: {
                    userId: existingUser.id,
                    plan: lookup,
                },
            },
            mode: 'subscription',
            success_url: `${process.env.NEXTAUTH_URL}/dashboard/billing/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/billing?canceled=true`,
        });

        redirect(session.url);
    }

    return (
        <form action={createCheckoutSession}>
            <Card className="min-w-[200px]">
                <CardHeader>
                    <CardTitle>{props.pricingName}</CardTitle>
                    <CardDescription>{props.pricingDesc}</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul>
                        {features.map((key) => (
                            <li key={key}>{key}</li>
                        ))}
                    </ul>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <input type="hidden" name="lookup_key" value={props.lookupKey} />
                    <Button type="submit">{props.pricingButton}</Button>
                </CardFooter>
            </Card>
        </form>
    );
}
