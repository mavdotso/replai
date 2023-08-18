import { BASE_URL } from '@/lib/constants';
import prismadb from '@/lib/prismadb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { token: string } }) {
    try {
        const { token } = params;

        const user = await prismadb.user.findFirst({
            where: {
                activateTokens: {
                    some: {
                        AND: [
                            {
                                activatedAt: null,
                            },
                            {
                                createdAt: {
                                    gt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24h
                                },
                            },
                            {
                                token,
                            },
                        ],
                    },
                },
            },
        });

        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found' }), { status: 500 });
        }

        await prismadb.user.update({
            where: {
                id: user.id,
            },
            data: {
                emailVerified: true,
            },
        });

        await prismadb.activateToken.update({
            where: {
                token,
            },
            data: {
                activatedAt: new Date(),
            },
        });

        // TODO: Redirect with a success message
        // TODO: Redirect with an error message

        return NextResponse.redirect(`${BASE_URL}/dashboard`);
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
