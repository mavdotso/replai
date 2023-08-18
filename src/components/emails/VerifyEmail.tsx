import { BASE_URL } from '@/lib/constants';
import { Body, Button, Container, Head, Heading, Html, Img, Link, Preview, Section, Tailwind, Text } from '@react-email/components';
import * as React from 'react';

interface VercelInviteUserEmailProps {
    email: string;
    token: string;
}

export default function VerifyEmail({ email, token }: VercelInviteUserEmailProps) {
    const previewText = `Verify your email on @replai`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
                        <Section className="mt-[32px]">
                            <Img src={`${BASE_URL}/public/logo.svg`} width="40" height="37" alt="replai" className="my-0 mx-auto" />
                        </Section>
                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">Verify your email address</Heading>
                        <Text className="text-black text-[14px] leading-[24px]">Hello {email},</Text>
                        <Text className="text-black text-[14px] leading-[24px]">Verify your email address to get access to @replai features and updates!</Text>
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button pX={20} pY={12} className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center" href={`${BASE_URL}/verify/${token}`}>
                                Verify email
                            </Button>
                        </Section>
                        <Text className="text-black text-[14px] leading-[24px]">
                            or copy and paste this URL into your browser:{' '}
                            <Link href={`${BASE_URL}/verify/${token}`} className="text-blue-600 no-underline">
                                {`${BASE_URL}/verify/${token}`}
                            </Link>
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
