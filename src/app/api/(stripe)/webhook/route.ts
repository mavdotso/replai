import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';
import prismadb from '@/lib/prismadb';
import { Plans } from '@prisma/client';

import { BASIC_MONTHLY_API_LIMIT, BUSINESS_MONTHLY_API_LIMIT, LIFETIME_MONTHLY_API_LIMIT, PRO_MONTHLY_API_LIMIT, TRIAL_MONTHLY_API_LIMIT } from '@/lib/constants';

const ENDPOINT_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
    const rawBody = await req.text();
    let event: Stripe.Event | undefined;

    console.log(rawBody);

    try {
        const signature = req.headers.get('stripe-signature') || '';

        event = stripe.webhooks.constructEvent(rawBody, signature, ENDPOINT_SECRET);
    } catch (error) {
        console.log('Webhook signature verification failed,', error.message);
        return new NextResponse('Invalid payload', { status: 400 });
    }

    // console.log('Event', event);

    switch (event.type) {
        case 'customer.subscription.updated':
            const subscription = event.data.object as Stripe.Subscription;

            const planStringFromMetadata = subscription.metadata.plan;
            const planEnumValue = mapStringToPlanEnum(planStringFromMetadata);
            const planApiLimit = setPlanApiLimit(planStringFromMetadata);

            const newSubscription = await prismadb.user.update({
                where: { id: subscription.metadata.userId },
                data: {
                    Plan: {
                        upsert: {
                            create: {
                                name: planEnumValue,
                                description: subscription.description,
                                price: subscription['plan'].amount / 100,
                                apiLimit: planApiLimit,
                            },
                            update: {
                                name: planEnumValue,
                                description: subscription.description,
                                price: subscription['plan'].amount / 100,
                                apiLimit: planApiLimit,
                            },
                        },
                    },
                    Subscription: {
                        upsert: {
                            create: {
                                id: subscription.id as string,
                                status: subscription.status as string,
                                currentPeriodEnd: new Date(subscription.current_period_end * 1000) as Date,
                                currentPeriodStart: new Date(subscription.current_period_start * 1000) as Date,
                            },
                            update: {
                                id: subscription.id as string,
                                status: subscription.status as string,
                                currentPeriodEnd: new Date(subscription.current_period_end * 1000) as Date,
                                currentPeriodStart: new Date(subscription.current_period_start * 1000) as Date,
                            },
                        },
                    },
                },
                include: {
                    Plan: true,
                    Subscription: true,
                },
            });

            console.log('New subscription: ', newSubscription);
    }

    return new NextResponse('Webhook received', { status: 200 });
}

export function mapStringToPlanEnum(planString: string): Plans | null {
    switch (planString) {
        case 'MBASIC':
            return Plans.MBASIC;
        case 'MPRO':
            return Plans.MPRO;
        case 'MBUSINESS':
            return Plans.MBUSINESS;
        case 'YBASIC':
            return Plans.YBASIC;
        case 'YPRO':
            return Plans.YPRO;
        case 'YBUSINESS':
            return Plans.YBUSINESS;
        case 'LIFETIME':
            return Plans.LIFETIME;
        default:
            return Plans.TRIAL;
    }
}

export function setPlanApiLimit(plan: string) {
    switch (plan) {
        case 'MBASIC':
            return BASIC_MONTHLY_API_LIMIT;
        case 'MPRO':
            return PRO_MONTHLY_API_LIMIT;
        case 'MBUSINESS':
            return BUSINESS_MONTHLY_API_LIMIT;
        case 'YBASIC':
            return BASIC_MONTHLY_API_LIMIT;
        case 'YPRO':
            return PRO_MONTHLY_API_LIMIT;
        case 'YBUSINESS':
            return BUSINESS_MONTHLY_API_LIMIT;
        case 'LIFETIME':
            return LIFETIME_MONTHLY_API_LIMIT;
        default:
            return TRIAL_MONTHLY_API_LIMIT;
    }
}
