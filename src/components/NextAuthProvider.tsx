'use client';

import React, { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';

interface Props {
    children: ReactNode;
    session: Session;
}

export default function NextAuthProvider({ children, session }: Props) {
    return <SessionProvider session={session}>{children}</SessionProvider>;
}
