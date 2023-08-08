import prismadb from '@/lib/prismadb';

interface RequestBody {
    email: string;
}

export async function POST(req: Request) {
    const body: RequestBody = await req.json();

    await prismadb.user.update({
        where: { id: body.email },
        data: {
            Plan: {
                update: {
                    apiLimit: {
                        increment: 1,
                    },
                },
            },
        },
    });
}

export async function GET(req: Request) {
    const body: RequestBody = await req.json();

    const userApiLimit = await prismadb.user.findUnique({
        where: { id: body.email },
        select: {
            Plan: {
                select: {
                    apiLimit: true,
                },
            },
        },
    });

    console.log('User API limit: ', userApiLimit);

    // if(userApiLimit < )

    return userApiLimit;
}
