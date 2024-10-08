import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import { type NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prismadb from '@/lib/prismadb';

interface Credentials {
    email: string;
    password: string;
}

const authorize = async (credentials: Credentials) => {
    if (!credentials || !credentials.password) {
        return null;
    }
    try {
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
            }),
        });
        const user = await res.json();

        if (res.ok && user) {
            return user;
        }
        return null;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
};

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
    },
    adapter: PrismaAdapter(prismadb),
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text', placeholder: '' },
                password: { label: 'Password', type: 'password' },
            },
            authorize,
        }),
    ],
    pages: {
        signIn: '/login',
        signOut: '/signout',
    },
    callbacks: {
        async jwt({ token, user, session, trigger }) {
            if (trigger === 'update' && session?.name) {
                token.name = session.name;
            }

            return { ...token, ...user, ...session };
        },

        async session({ session, token, user }) {
            session.user = token as any;

            return {
                ...session,
                user: { ...session.user, ...user }, // combine the session and db user
            };
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
