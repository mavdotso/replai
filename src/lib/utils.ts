import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Plans } from '@prisma/client';

import { BASIC_MONTHLY_API_LIMIT, BUSINESS_MONTHLY_API_LIMIT, LIFETIME_MONTHLY_API_LIMIT, PRO_MONTHLY_API_LIMIT, TRIAL_MONTHLY_API_LIMIT } from '@/lib/constants';

export function cn(...inputs: any[]): string {
    return twMerge(clsx(inputs));
}

export function mapStringToPlanEnum(planString: string): Plans | null {
    switch (planString) {
        case 'MBASIC':
            return Plans.MBASIC;
        case 'MPRO':
            return Plans.MPRO;
        case 'MBUSINESS':
            return Plans.MBUSINESS;
        case 'YBASIC':
            return Plans.YBASIC;
        case 'YPRO':
            return Plans.YPRO;
        case 'YBUSINESS':
            return Plans.YBUSINESS;
        case 'LIFETIME':
            return Plans.LIFETIME;
        default:
            return Plans.TRIAL;
    }
}

export function setPlanApiLimit(plan) {
    switch (plan) {
        case 'MBASIC':
            return BASIC_MONTHLY_API_LIMIT;
        case 'MPRO':
            return PRO_MONTHLY_API_LIMIT;
        case 'MBUSINESS':
            return BUSINESS_MONTHLY_API_LIMIT;
        case 'YBASIC':
            return BASIC_MONTHLY_API_LIMIT;
        case 'YPRO':
            return PRO_MONTHLY_API_LIMIT;
        case 'YBUSINESS':
            return BUSINESS_MONTHLY_API_LIMIT;
        case 'LIFETIME':
            return LIFETIME_MONTHLY_API_LIMIT;
        default:
            return TRIAL_MONTHLY_API_LIMIT;
    }
}
