import { signJwtAccessToken } from '@/lib/jwt';
import prismadb from '@/lib/prismadb';
import * as bcrypt from 'bcryptjs';

interface RequestBody {
    email: string;
    password: string;
}

export async function POST(request: Request) {
    const body: RequestBody = await request.json();

    const user = await prismadb.user.findUnique({
        where: {
            email: body.email,
        },
    });

    if (!user) {
        return null;
    }

    if (user && bcrypt.compareSync(body.password, user.password)) {
        const { password, ...userWithoutPass } = user;

        // Checking JWT token
        const accessToken = await signJwtAccessToken(userWithoutPass);
        const result = {
            ...userWithoutPass,
            accessToken,
        };

        return new Response(JSON.stringify(result));
    } else {
        return new Response(JSON.stringify(null));
    }
}
