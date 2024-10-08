import { Separator } from '@/components/ui/separator';
import { SidebarNav } from '@/components/SidebarNav';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'Dashboard',
    description: 'Manage your account',
};

const sidebarNavItems = [
    {
        title: 'Account',
        href: '/dashboard',
    },
    {
        title: 'Billing',
        href: '/dashboard/billing',
    },
];

export default function DashboardLayout({ children }) {
    return (
        <>
            <Header />
            <main className="container relative pt-32 pb-12 max-w-6xl">
                <div className="space-y-6 md:block">
                    <div className="space-y-0.5">
                        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
                        <p className="text-muted-foreground">Manage your account and payments</p>
                    </div>
                    <Separator className="my-6" />
                    <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                        <aside className="-mx-4 lg:w-1/6">
                            <SidebarNav items={sidebarNavItems} />
                        </aside>
                        <div className="flex-1 lg:max-w-2xl">{children}</div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
