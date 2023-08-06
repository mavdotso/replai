export const metadata = {
    title: '@replai',
    description: '@replai - Your smart social media assistant',
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
