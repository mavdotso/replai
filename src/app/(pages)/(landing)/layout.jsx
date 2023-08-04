'use client';

import { useEffect } from 'react';

import AOS from 'aos';
import 'aos/dist/aos.css';

import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function DefaultLayout({ children }) {
    useEffect(() => {
        AOS.init({
            once: true,
            disable: 'phone',
            duration: 700,
            easing: 'ease-out-cubic',
        });
    });

    return (
        <>
            <Header />
            <main className="grow [text-wrap:balance]">{children}</main>
            <Footer />
        </>
    );
}
