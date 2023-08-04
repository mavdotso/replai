export const metadata = {
    title: 'Home - Simple',
    description: 'Page description',
};

import Hero from '@/components/(landing)/Hero';
import Features from '@/components/(landing)/Features';
import FeaturesBlocks from '@/components/(landing)/FeaturesBlocks';
import Testimonials from '@/components/(landing)/Testimonials';

export default function Home() {
    return (
        <>
            <Hero />
            <Features />
            <FeaturesBlocks />
            <Testimonials />
        </>
    );
}
