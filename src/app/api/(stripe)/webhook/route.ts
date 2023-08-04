import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';
import prismadb from '@/lib/prismadb';

const ENDPOINT_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
    console.log('Webhook activated');

    let event: Stripe.Event | undefined;

    try {
        const signature = req.headers.get('stripe-signature') || '';
        event = stripe.webhooks.constructEvent(await req.text(), signature, ENDPOINT_SECRET);
    } catch (error) {
        console.log('Webhook signature verification failed,', error.message);
        return new NextResponse('Invalid payload', { status: 400 });
    }

    // console.log("Event", event);

    switch (event.type) {
        case 'customer.subscription.updated':
            const subscription = event.data.object as Stripe.Subscription;
            const customer = await prismadb.user.findUnique({
                where: { id: subscription.metadata.userId },
                include: { Subscription: true }, // Include the related Subscription data
            });

            await prismadb.subscription.update({
                where: { id: customer.Subscription.id },
                data: {
                    status: subscription.status as string,
                    currentPeriodEnd: new Date(subscription.current_period_end * 1000) as Date,
                    currentPeriodStart: new Date(subscription.current_period_start * 1000) as Date,
                },
            });
    }

    return new NextResponse('Webhook received', { status: 200 });
}
