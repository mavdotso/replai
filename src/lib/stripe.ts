import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_API_KEY!, { apiVersion: '2022-11-15', typescript: true });

// export const endpoint = stripe.webhookEndpoints.create({
//     url: `${process.env.VERCEL_URL}/api/webhook` || "https://localhost:3000/api/webhook",
//     enabled_events: ["payment_intent.payment_failed", "payment_intent.succeeded"],
// });
