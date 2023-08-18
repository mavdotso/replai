import prismadb from '@/lib/prismadb';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

// TODO: Check if this works

export async function GET(req: NextRequest, { params }: { params: { verificationHash: string } }) {
    try {
        const { verificationHash } = params;

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
                                    gt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24h ago
                                },
                            },
                            {
                                token: verificationHash,
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
                token: verificationHash,
            },
            data: {
                activatedAt: new Date(),
            },
        });

        // TODO: Redirect with a success message
        // TODO: Redirect with an error message
        redirect('/dashboard');
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
