import { Verify } from '@/components/emails/VerifyTemplate';
import { NextResponse } from 'next/server';
import { resend, serviceEmail } from '@/lib/resend';

export async function POST() {
    try {
        const data = await resend.emails.send({
            from: `@replai <${serviceEmail}>`,
            to: ['delivered@resend.dev'],
            subject: 'Verify your email address',
            react: Verify({ firstName: 'John', verificationLink: 'verificationLink' }),
        });

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error });
    }
}
