// Monthly API limits
export const TRIAL_MONTHLY_API_LIMIT = 100;
export const BASIC_MONTHLY_API_LIMIT = 300;
export const PRO_MONTHLY_API_LIMIT = 1000;
export const BUSINESS_MONTHLY_API_LIMIT = 0;
export const LIFETIME_MONTHLY_API_LIMIT = 0;

export const BASE_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
