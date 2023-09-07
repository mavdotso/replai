export const metadata = {
    title: '@replai',
    description: '@replai - Your smart social media assistant',
};

import Hero from '@/components/(landing)/Hero';
import Mockup from '@/components/(landing)/Mockup';
import Icons from '@/components/(landing)/Icons';
import Pricing from '@/components/(landing)/Pricing';

export default function Home() {
    return (
        <>
            <Hero />
            <Mockup />
            <Icons />
            <Pricing />
        </>
    );
}
