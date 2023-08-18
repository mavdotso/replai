import prismadb from '@/lib/prismadb';
import { NextRequest } from 'next/server';

interface RequestBody {
    email: string;
}

export async function POST(request: NextRequest) {
    try {
        const { email, values } = await request.json();

        const user = await prismadb.user.update({
            where: {
                email,
            },
            data: {
                email: values.email,
            },
        });

        if (user) {
            console.log('OK!');
        } else {
            console.log('Not Ok!');
        }

        return new Response(JSON.stringify(user));
    } catch (error) {
        return new Response(JSON.stringify(null));
    }
}
