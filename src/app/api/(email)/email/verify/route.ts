import { Verify } from '@/components/emails/VerifyTemplate';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.SERVICE_EMAIL;

export async function POST() {
    try {
        const data = await resend.emails.send({
            from: `@replai <${fromEmail}>`,
            to: ['delivered@resend.dev'],
            subject: 'Verify your email address',
            react: Verify({ firstName: 'John', verificationLink: 'verificationLink' }),
        });

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error });
    }
}
