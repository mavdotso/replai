'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import Link from 'next/link';
import Logo from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import MobileMenu from '@/components/MobileMenu';
import { UserNav } from './UserNav';

import { buttonVariants } from '@/components/ui/button';

export default function Header() {
    const [top, setTop] = useState(true);
    const [isLoggedIn, setLoggedIn] = useState(false);

    const { data: session } = useSession();

    useEffect(() => {
        if (session !== undefined || session !== null) {
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
        }
    }, [session]);

    // detect whether user has scrolled the page down by 10px
    const scrollHandler = () => {
        window.pageYOffset > 10 ? setTop(false) : setTop(true);
    };

    useEffect(() => {
        scrollHandler();
        window.addEventListener('scroll', scrollHandler);
        return () => window.removeEventListener('scroll', scrollHandler);
    }, [top]);

    return (
        <header className={`fixed w-full z-30 md:bg-opacity-70 transition duration-300 ease-in-out ${!top ? 'bg-white backdrop-blur shadow-sm dark:bg-zinc-950/70' : ''}`}>
            <div className="max-w-6xl mx-auto px-5 sm:px-6">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Site branding */}
                    <div className="shrink-0 mr-4">
                        <Logo />
                    </div>

                    {/* Desktop navigation */}
                    <nav className="hidden md:flex md:grow">
                        {/* Desktop sign in links */}
                        <ul className="flex grow justify-end flex-wrap items-center gap-4">
                            <li>
                                <ThemeToggle />
                            </li>
                            {isLoggedIn ? (
                                <>
                                    <UserNav />
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link href="/login" className={buttonVariants({ variant: 'outline' })}>
                                            Sign in
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/register" className={buttonVariants({ variant: 'default' })}>
                                            Sign up
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </nav>

                    <MobileMenu />
                </div>
            </div>
        </header>
    );
}
