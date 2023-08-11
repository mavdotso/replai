import VerifyEmail from '@/components/emails/VerifyEmail';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import * as bcrypt from 'bcryptjs';
import prismadb from '@/lib/prismadb';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    const { email } = await req.json();

    const verificationHash = await bcrypt.hash(email.toString(), 10);

    try {
        await prismadb.user.update({
            where: {
                email: email,
            },
            data: {},
        });

        const data = await resend.emails.send({
            from: `Mav <${process.env.RESEND_SERVICE_EMAIL}>`,
            to: [email],
            subject: 'Verify your email address',
            react: VerifyEmail({ email, verificationHash }),
        });

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error });
    }
}
