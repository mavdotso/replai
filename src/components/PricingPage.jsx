import { stripe } from '@/lib/stripe';
import { PricingCard } from '@/components/PricingCard';

async function PricingPage() {
    const { data: prices } = await stripe.prices.list();

    const plans = await Promise.all(
        prices.map(async (price) => {
            const product = await stripe.products.retrieve(price.product);
            // Check if the plan is active and return it
            // TODO: Check monthly / yearly prices and return to the diff cards
            return {
                id: price.id,
                name: product.name,
                description: product.description,
                price: price.unit_amount / 100,
                interval: price.recurring.interval,
                currency: price.currency,
                metadata: product.metadata,
                lookupKey: price.lookup_key,
                isActive: product.active,
            };
        })
    );

    // Check if the plan is active
    const activePlans = plans.filter((plan) => {
        if (plan.isActive) {
            return true;
        }
    });

    return (
        <div className="grid grid-cols-2 gap-4">
            {activePlans
                .slice(0)
                .reverse()
                .map((plan) => (
                    <PricingCard key={plan.id} pricingName={plan.name} pricingDesc={plan.description} pricingKey={plan.metadata} lookupKey={plan.lookupKey} pricingButton={'Upgrade'} />
                ))}
        </div>
    );
}

export default PricingPage;
