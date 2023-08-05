import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { Plans } from '@prisma/client';

export async function GET() {
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
        2;
        await prismadb.user.update({
            where: {
                id: expiredUsers[i].id,
            },
            data: {
                Plan: {
                    update: {
                        data: {
                            name: Plans.TRIAL,
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
}
