import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { Plans } from '@prisma/client';
import { TRIAL_MONTHLY_API_LIMIT } from '@/lib/constants';

export async function GET() {
    try {
        // Find all users with paid subscriptions
        const expiredUsers = await prismadb.user.findMany({
            where: {
                Subscription: {
                    currentPeriodEnd: {
                        lte: new Date(),
                    },
                },
            },
            include: {
                Subscription: true,
            },
        });

        // For each found expired user update status and plan
        for (let i = 0; i < expiredUsers.length; i++) {
            const subscription = expiredUsers[i].Subscription;
            await prismadb.user.update({
                where: {
                    id: expiredUsers[i].id,
                },
                data: {
                    Plan: {
                        update: {
                            data: {
                                name: Plans.TRIAL,
                                apiLimit: TRIAL_MONTHLY_API_LIMIT,
                            },
                        },
                    },
                    Subscription: {
                        update: {
                            where: {
                                status: subscription.status,
                            },
                            data: {
                                status: 'expired',
                            },
                        },
                    },
                },
                include: {
                    Plan: true,
                    Subscription: true,
                },
            });
        }

        console.log('CRON finished, updated: ', expiredUsers.length);

        return NextResponse.json({ updated: expiredUsers.length });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
