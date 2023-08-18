import VerifyEmail from '@/components/emails/VerifyEmail';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import prismadb from '@/lib/prismadb';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    // TODO: Make it a universal place to send different types of emails (with switch/case?)
    const { email, token } = await req.json();

    try {
        await prismadb.user.update({
            where: {
                email: email,
            },
            data: {},
        });

        const data = await resend.emails.send({
            from: `Mav from @replai <${process.env.RESEND_SERVICE_EMAIL}>`,
            to: [email],
            subject: 'Verify your email address',
            react: VerifyEmail({ email, token }),
        });

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error });
    }
}
