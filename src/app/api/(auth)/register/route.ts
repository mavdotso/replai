import VerifyEmail from '@/components/emails/VerifyEmail';
import prismadb from '@/lib/prismadb';
import * as bcrypt from 'bcryptjs';
import { Resend } from 'resend';
interface RequestBody {
    email: string;
    password: string;
}
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body: RequestBody = await request.json();

        const hashedPassword = bcrypt.hashSync(body.password, 10);

        const newUser = await prismadb.user.create({
            data: {
                email: body.email,
                password: hashedPassword,
            },
        });

        if (newUser) {
            const verificationHash = await prismadb.activateToken.create({
                data: {
                    token: `${bcrypt.hashSync(newUser.toString(), 10)}`.replace(/-/g, ''),
                    userId: newUser.id,
                },
            });

            try {
                // TODO: MAKE A FETCH REQUEST TO api/send INSTEAD
                await resend.emails.send({
                    from: `Mav <${process.env.RESEND_SERVICE_EMAIL}>`,
                    to: [newUser.email],
                    subject: 'Verify your email address',
                    react: VerifyEmail({ email: newUser.email, verificationHash: verificationHash.token }),
                });
            } catch (error) {
                console.error('Error:', error);
                return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
            }

            return new Response(JSON.stringify(newUser));
        } else {
            return new Response(JSON.stringify(null));
        }
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
