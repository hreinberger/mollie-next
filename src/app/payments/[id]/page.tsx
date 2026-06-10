import { Flex, Heading } from '@radix-ui/themes';
import { redirect } from 'next/navigation';

import { validateMolliePayment } from '@/app/lib/validation';
import { getSession } from '@/app/lib/auth';
import PaymentOverview from '@/app/components/ui/paymentoverview';

export default async function Page({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams?: Promise<{ mode?: string }>;
}) {
    const input = (await params).id;
    const id = await validateMolliePayment(input);

    const rawMode = (await searchParams)?.mode;
    const session = await getSession();
    const isMollie = session?.isMollie === true;

    const mode: 'test' | 'live' =
        isMollie && rawMode === 'live' ? 'live' : 'test';

    if (rawMode === 'live' && !isMollie) {
        redirect('/api/auth/login');
    }

    return (
        <main>
            <Flex
                direction="column"
                m="6"
            >
                <Heading>Payment Details</Heading>
                <PaymentOverview id={id} mode={mode} />
            </Flex>
        </main>
    );
}
