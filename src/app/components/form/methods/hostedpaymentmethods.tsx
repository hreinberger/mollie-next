import { mollieGetMethods } from '@/app/lib/mollie';
import HostedPaymentMethodsInteractive from './hostedpaymentmethods-interactive';

export default async function HostedPaymentMethodCards({
    currency,
    country,
}: {
    currency?: string;
    country?: string;
}) {
    const methods = await mollieGetMethods(currency, country);

    // Serialize to plain objects before crossing the Server/Client boundary.
    // Mollie SDK returns class instances; only primitive fields can be passed as props.
    const serialized = methods.map((m) => ({
        id: m.id,
        description: m.description,
    }));

    return <HostedPaymentMethodsInteractive methods={serialized} />;
}
