import { Callout, Flex, Heading } from '@radix-ui/themes';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { ViewTransition } from 'react';

import { getSession } from '@/app/lib/auth';
import { validateBalanceTransactionId } from '@/app/lib/validation';
import BalanceTransactionOverview from '@/app/components/balances/balancetransactionoverview';

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const input = (await params).id;
    const id = await validateBalanceTransactionId(input);

    const session = await getSession();
    if (session?.isMollie !== true) {
        return (
            <main>
                <Flex direction="column" gap="4" m="6">
                    <Heading>Balance Transaction Details</Heading>
                    <Callout.Root>
                        <Callout.Icon>
                            <InfoCircledIcon />
                        </Callout.Icon>
                        <Callout.Text>
                            Sign in with your @mollie.com email to view balance
                            transactions.
                        </Callout.Text>
                    </Callout.Root>
                </Flex>
            </main>
        );
    }

    return (
        <ViewTransition>
            <main>
                <Flex direction="column" m="6">
                    <Heading>Balance Transaction Details</Heading>
                    <BalanceTransactionOverview id={id} />
                </Flex>
            </main>
        </ViewTransition>
    );
}
