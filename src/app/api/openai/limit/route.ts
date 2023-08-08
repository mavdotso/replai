import prismadb from '@/lib/prismadb';
import { verifyJwt } from '@/lib/jwt';
import { NextResponse } from 'next/server';

// Check if the limit != 0
export async function POST(req: Request) {
    try {
        const accessToken = req.headers.get('accessToken');
        const body = await req.json();
        const { email } = body;

        const isVerified = await verifyJwt(accessToken);

        if (!accessToken || !isVerified) {
            return new NextResponse('Unauthorised', { status: 401 });
        }

        const userApiLimit = await prismadb.user.findUnique({
            where: { email: email },
            select: {
                Plan: {
                    select: {
                        apiLimit: true,
                    },
                },
            },
        });

        if (userApiLimit.Plan.apiLimit <= 0) {
            return NextResponse.json({ error: 'User has crossed the limit!', userApiLimit }, { status: 402 });
        } else {
            return NextResponse.json({ success: 'User API has credits', userApiLimit }, { status: 200 });
        }
    } catch (error) {
        console.error('Error parsing JSON response:', error);
        return NextResponse.json({ error: 'Error parsing JSON response' }, { status: 500 });
    }
}
