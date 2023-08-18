import prismadb from '@/lib/prismadb';
import * as bcrypt from 'bcryptjs';
import slugify from 'slugify';

interface RequestBody {
    email: string;
    password: string;
}

// FIXME: Remember to delete localhost in prod
const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

export async function POST(request: Request) {
    try {
        const body: RequestBody = await request.json();
        const hashedPassword = bcrypt.hashSync(body.password, 10);

        // Create a new user
        const user = await prismadb.user.create({
            data: {
                email: body.email,
                password: hashedPassword,
            },
        });

        // Generate and slugify a verification token
        const token = await prismadb.activateToken.create({
            data: {
                token: slugify(`${bcrypt.hashSync(user.email.toString(), 10)}`, { remove: /[*+~.()'"!:@$]/g, strict: true }),
                userId: user.id,
            },
        });

        // Send a verification email
        await fetch(`${baseUrl}/api/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: user.email, token: token.token }),
        });

        return new Response(JSON.stringify(user));
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
