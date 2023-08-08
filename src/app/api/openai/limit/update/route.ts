import prismadb from '@/lib/prismadb';
import { verifyJwt } from '@/lib/jwt';
import { NextResponse } from 'next/server';

interface RequestBody {
    email: string;
}

export async function POST(req: Request) {
    const accessToken = req.headers.get('accessToken');
    const body = await req.json();
    const { email } = body;

    const isVerified = await verifyJwt(accessToken);

    if (!accessToken || !isVerified) {
        return new NextResponse('Unauthorised', { status: 401 });
    }

    const updatedLimit = await prismadb.user.update({
        where: { email: email },
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
}
