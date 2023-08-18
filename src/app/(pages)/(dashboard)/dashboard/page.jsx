import { Separator } from '@/components/ui/separator';
import { AccountForm } from '@/components/AccountForm';

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg fńont-medium">Account</h3>
                <p className="text-sm text-muted-foreground">Update your account settings. Set your preferred language and timezone.</p>
            </div>
            <Separator />
            <AccountForm />
        </div>
    );
}
