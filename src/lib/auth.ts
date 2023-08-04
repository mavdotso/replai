import { getServerSession, Session } from 'next-auth';

export type AuthUser = Session & {
    id?: string;
    email?: string;
    emailVerified?: Date;
    image?: string;
    createdAt?: Date;
    stripeCustomerId?: string;
    subscriptionId?: string;
    stripePaymentMethodId?: string;
    accessToken?: string;
};

export const getUserSession = async (): Promise<AuthUser> => {
    const session = await getServerSession();

    if (!session) throw new Error('Unauthorised');

    return session;
};
