import './globals.css';
import { Inter } from 'next/font/google';

import NextAuthProvider from '@/components/NextAuthProvider';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: '@replai',
    description: 'Your smart Social Media assistant',
};

export default function RootLayout({ children }) {
    return (
        <NextAuthProvider>
            <html lang="en">
                <body className={inter.className}>
                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                        {children}
                    </ThemeProvider>
                </body>
            </html>
        </NextAuthProvider>
    );
}
