import { Separator } from '@/components/ui/separator';
import PricingPage from '@/components/PricingPage';
import { Button } from '@/components/ui/button';
import { stripe } from '@/lib/stripe';
import { redirect } from 'next/navigation';
import prismadb from '@/lib/prismadb';
import { getUserSession } from '@/lib/auth';

export default async function BillingPage() {
    async function createCheckoutSession(data) {
        'use server';
        const { user } = await getUserSession();

        const existingUser = await prismadb.user.findUnique({
            where: { email: user.email },
        });

        console.log(existingUser);

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
                },
            },
            mode: 'subscription',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?canceled=true`,
        });

        redirect(session.url);
    }

    async function createPortalSession() {
        'use server';
        const { user } = await getUserSession();

        const existingCustomer = await prismadb.user.findUnique({
            where: { email: user.email },
        });

        if (!existingCustomer) throw new Error('No existing customer');
        if (!existingCustomer.stripeCustomerId) throw new Error('Not a customer');

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: existingCustomer.stripeCustomerId,
            return_url: `${process.env.NEXTAUTH_URL}/dashboard/billing`,
        });

        redirect(portalSession.url);
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Billing</h3>
                <p className="text-sm text-muted-foreground">Modify your subscription plans</p>
            </div>
            <Separator />
            <div className="grid grid-cols-2">
                <div>
                    <h3>Manage Subscription:</h3>
                    <form action={createPortalSession}>
                        <Button type="submit">Manage subscription</Button>
                    </form>
                </div>
                <div>
                    <h3>Current plan:</h3>
                    <form action={createCheckoutSession}>
                        <input type="hidden" name="lookup_key" value="pro-monthly" />
                        <Button type="submit">Upgrade to pro mo</Button>
                    </form>
                </div>
            </div>

            <Separator />

            <PricingPage />
        </div>
    );
}
