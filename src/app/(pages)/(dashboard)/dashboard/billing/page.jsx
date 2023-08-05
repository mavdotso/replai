import { Separator } from '@/components/ui/separator';
import PricingPage from '@/components/PricingPage';
import { Button } from '@/components/ui/button';
import { stripe } from '@/lib/stripe';
import { redirect } from 'next/navigation';
import prismadb from '@/lib/prismadb';
import { getUserSession } from '@/lib/auth';

export default async function BillingPage() {
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
                </div>
            </div>

            <Separator />

            <PricingPage />
        </div>
    );
}
