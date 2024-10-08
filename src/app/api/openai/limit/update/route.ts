import prismadb from '@/lib/prismadb';
import { verifyJwt } from '@/lib/jwt';
import { NextResponse } from 'next/server';

interface RequestBody {
    email: string;
}

export async function POST(req: Request) {
    try {
        const accessToken = req.headers.get('accessToken');
        const body = await req.json();

        const isVerified = await verifyJwt(accessToken);

        if (!accessToken || !isVerified) {
            return new NextResponse('Unauthorised', { status: 401 });
        }

        const updatedLimit = await prismadb.user.update({
            where: { email: body.email },
            data: {
                Plan: {
                    update: {
                        apiLimit: {
                            decrement: 1,
                        },
                    },
                },
            },
            select: {
                Plan: {
                    select: {
                        apiLimit: true,
                    },
                },
            },
        });

        return NextResponse.json(updatedLimit, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
