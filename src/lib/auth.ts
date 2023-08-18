import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/app/api/(auth)/auth/[...nextauth]/route';

export type AuthUser = Session & {
    id?: string;
    email?: string;
    emailVerified?: boolean;
    image?: string;
    openaiApi?: string;
    Plan?: object;
    stripeCustomerId?: string;
    Subscription?: object;
};

export const getUserSession = async (): Promise<AuthUser> => {
    const session = await getServerSession(authOptions);

    if (!session) throw new Error('Unauthorised');

    return session;
};
