import prismadb from '@/lib/prismadb';
import * as bcrypt from 'bcryptjs';
import { stripe } from '@/lib/stripe';

interface RequestBody {
    email: string;
    password: string;
}

export async function POST(request: Request) {
    const body: RequestBody = await request.json();

    const hashedPassword = bcrypt.hashSync(body.password, 10);

    const newUser = await prismadb.user.create({
        data: {
            email: body.email,
            password: hashedPassword,
        },
    });

    if (newUser) {
        return new Response(JSON.stringify(newUser));
    } else {
        return new Response(JSON.stringify(null));
    }
}
