import { cacheLife } from 'next/cache';
import { mollieGetMethods } from '@/app/lib/mollie';
import HostedPaymentMethodsInteractive from './hostedpaymentmethods-interactive';

export default async function HostedPaymentMethodCards({
    currency,
    country,
}: {
    currency?: string;
    country?: string;
}) {
    'use cache';
    cacheLife('paymentMethods');

    const methods = await mollieGetMethods(currency, country);

    // Only pass the fields the client component needs across the boundary.
    const serialized = methods.flatMap((m) =>
        m.id ? [{ id: m.id, description: m.description }] : [],
    );

    return <HostedPaymentMethodsInteractive methods={serialized} />;
}
