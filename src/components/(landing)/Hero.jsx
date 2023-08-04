import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

export default function Hero() {
    return (
        <section className="relative">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                {/* Hero content */}
                <div className="pt-32 pb-12 md:pt-40 md:pb-20">
                    {/* Section header */}
                    <div className="text-center pb-12 md:pb-16">
                        <h1 className="sm:text-8xl text-6xl font-bold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out">
                            Boost Your LinkedIn Engagement with <span className="bg-clip-text text-transparent bg-gradient-to-r from-zinc-500 to-zinc-950">Smart AI Assistant</span>
                        </h1>
                        <div className="max-w-3xl mx-auto">
                            <p className="sm:text-2xl text-xl text-gray-600 mb-8" data-aos="zoom-y-out" data-aos-delay="150">
                                Grow your network and save time with AI-powered extension made for networking and outreach.
                            </p>
                            <div className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center gap-4" data-aos="zoom-y-out" data-aos-delay="300">
                                <div>
                                    <Link className={buttonVariants({ variant: 'default', size: 'lg' })} href="#0">
                                        Start free trial
                                    </Link>
                                </div>
                                <div>
                                    <Link className={buttonVariants({ variant: 'outline', size: 'lg' })} href="#0">
                                        Learn more
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
