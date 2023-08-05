import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { Plans } from '@prisma/client';

export async function GET() {
    // Find all users with paid subscriptions
    const expiredUsers = await prismadb.user.findMany({
        where: {
            NOT: [{ Plan: { name: Plans.TRIAL || Plans.LIFETIME } }],
        },
        include: {
            Subscription: {
                where: {
                    currentPeriodEnd: {
                        lte: new Date(),
                    },
                },
            },
        },
    });

    // For each found expired user update status and plan
    for (let i = 0; i < expiredUsers.length; i++) {
        await prismadb.user.update({
            where: {
                id: expiredUsers[i].id,
            },
            data: {
                Plan: { update: { name: Plans.TRIAL } },
                Subscription: {
                    update: {
                        where: {
                            status: expiredUsers[i].Subscription.status,
                        },
                        data: {
                            status: 'expired',
                        },
                    },
                },
            },
            include: {
                Subscription: true,
            },
        });
    }

    console.log('CRON finished, updated: ', expiredUsers.length);

    return NextResponse.json({ updated: expiredUsers.length });
}
