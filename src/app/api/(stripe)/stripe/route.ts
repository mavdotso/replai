import { NextResponse, NextRequest } from 'next/server';
import { getSession } from 'next-auth/react';
import prismadb from '@/lib/prismadb';
import { stripe } from '@/lib/stripe';

interface Subscription {
    id: string;
    stripeCustomerId: string;
}

export async function GET(req: any) {
    try {
        const session = await getSession({ req });

        console.log(session);

        if (!session || !session.user) {
            return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
            });
        }
    } catch (error) {
        console.log('Stripe error: ', error);
        return new NextResponse(JSON.stringify({ error: 'Internal Error' }), {
            status: 500,
        });
    }
}
