import { Check } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

export default function Pricing() {
    return (
        <section className="container flex items-center">
            <div className="text-center mx-auto pb-24">
                <h3 className="text-2xl font-bold pb-4">Pricing</h3>
                <p className="text-gray-600">Simple pricing for all of your needs</p>
                <div className="flex pt-10 gap-6">
                    <div className="border border-[#E2E8F0] p-8 rounded-lg text-left space-y-4 max-w-xs">
                        <p className="font-bold">Standard</p>
                        <p>
                            <span className="text-4xl font-bold">$9</span> /month
                        </p>
                        <p>Perfect if you’re just getting started on LinkedIn</p>
                        <ul>
                            <li className="flex gap-2">
                                <Check />
                                Up to 300 generated comments
                            </li>
                        </ul>
                        <div className="text-center pt-4">
                            <Link className={buttonVariants({ variant: 'default', size: 'lg' })} href="#0">
                                Start free trial
                            </Link>
                        </div>
                    </div>
                    <div className="bg-neutral-900 text-white p-8 rounded-lg text-left space-y-4 max-w-xs">
                        <p className="font-bold">Pro</p>
                        <p>
                            <span className="text-4xl font-bold">$19</span> /month
                        </p>
                        <p>If you want to take your growth seriously</p>
                        <ul>
                            <li className="flex gap-2">
                                <Check />
                                Unlimited generations per month
                            </li>
                        </ul>
                        <div className="text-center pt-4">
                            <Link className={buttonVariants({ variant: 'secondary', size: 'lg' })} href="#0">
                                Start free trial
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
