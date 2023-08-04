import { NextRequest } from 'next/server';
import { getUserSession } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { redirect } from 'next/navigation';
import prismadb from '@/lib/prismadb';

export async function GET(req: NextRequest) {
    const { user } = await getUserSession();

    const session_id = req.nextUrl.searchParams.get('session_id');

    if (!session_id) {
        redirect('/dashboard/billing');
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

    // Update the User record with the new stripeCustomerId
    await prismadb.user.update({
        where: { email: user.email },
        data: {
            stripeCustomerId: checkoutSession.customer as string,
        },
    });

    redirect('/dashboard/billing');
}
