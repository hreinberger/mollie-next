import { Flex, Heading } from '@radix-ui/themes';
import { getSession } from '@/app/lib/auth';
import { mollieGetPayments } from '@/app/lib/mollie';
import { validateMolliePayment } from '@/app/lib/validation';
import PaymentsTable from '../components/ui/paymentstable';
import PaymentCards from '../components/ui/PaymentCards';
import PaymentsControls from '../components/ui/PaymentsControls';

export default async function Page(props: {
    searchParams?: Promise<{ mode?: string; from?: string }>;
}) {
    const searchParams = await props.searchParams;
    const rawMode = searchParams?.mode;
    const rawFrom = searchParams?.from;

    const session = await getSession();
    const isMollie = session?.isMollie === true;

    const mode: 'test' | 'live' =
        isMollie && rawMode === 'live' ? 'live' : 'test';

    let from: string | undefined;
    if (rawFrom) {
        try {
            from = await validateMolliePayment(rawFrom);
        } catch {
            from = undefined;
        }
    }

    const { payments, nextPageCursor, previousPageCursor } =
        await mollieGetPayments({ mode, from });

    return (
        <main>
            <Flex direction="column" gap="4" m="6">
                <Heading>Recent Payments</Heading>
                <PaymentsControls
                    isMollie={isMollie}
                    mode={mode}
                    nextCursor={nextPageCursor ?? null}
                    prevCursor={previousPageCursor ?? null}
                />
                <div className="hidden md:block">
                    <PaymentsTable payments={payments} />
                </div>
                <div className="block md:hidden">
                    <PaymentCards payments={payments} />
                </div>
            </Flex>
        </main>
    );
}
