import Image from 'next/image';

export default function Mockup() {
    return (
        <section className="border border-[#E2E8F0] z-1 overflow-hidden" data-aos="zoom-y-out" data-aos-delay="150">
            <div className="container grid grid-cols-2 gap-20 mx-auto py-24">
                <Image src="/mockup.svg" width="600" height="600" className="place-self-end rounded-lg shadow-lg mt-[-250px]" data-aos="fade-down" data-aos-delay="350" />
                <div className="max-w-md self-center">
                    <h3 className="text-2xl font-bold pb-4">Boost Your LinkedIn Engagement</h3>
                    <p className="text-gray-600">
                        Engaging with the target audience on LinkedIn boosts your growth, but creating valuable comments is time-consuming.
                        <br />
                        <br />
                        @replai streamlines this process by generating tailored comments with a single click!
                    </p>
                </div>
            </div>
        </section>
    );
}
