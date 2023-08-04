import { signIn } from 'next-auth/react';

export default async function SignIn(email: string, password: string) {
    try {
        const res = await signIn('credentials', {
            email: email,
            password: password,
            redirect: false,
        });
        return res;
    } catch (error) {
        throw new Error('Error! ', error);
    }
}
