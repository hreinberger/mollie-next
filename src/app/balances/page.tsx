import { Callout, Flex, Heading } from '@radix-ui/themes';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { getSession } from '@/app/lib/auth';
import {
    mollieGetBalanceTransactions,
    mollieGetPrimaryBalance,
} from '@/app/lib/mollie';
import {
    validateBalanceTransactionHistory,
    validateBalanceTransactionId,
} from '@/app/lib/validation';
import BalanceCard from '../components/balances/balancecard';
import BalanceTransactionsTable from '../components/balances/balancetransactionstable';
import BalancesControls from '../components/balances/BalancesControls';
import { ViewTransition } from 'react';

export default async function Page(props: {
    searchParams?: Promise<{ from?: string; history?: string }>;
}) {
    const searchParams = await props.searchParams;
    const session = await getSession();

    if (session?.isMollie !== true) {
        return (
            <main>
                <Flex direction="column" gap="4" m="6">
                    <Heading>Balances</Heading>
                    <Callout.Root>
                        <Callout.Icon>
                            <InfoCircledIcon />
                        </Callout.Icon>
                        <Callout.Text>
                            Sign in with your @mollie.com email to view balances.
                        </Callout.Text>
                    </Callout.Root>
                </Flex>
            </main>
        );
    }

    let from: string | undefined;
    if (searchParams?.from) {
        try {
            from = await validateBalanceTransactionId(searchParams.from);
        } catch {
            from = undefined;
        }
    }

    let history: string[] = [];
    if (searchParams?.history) {
        try {
            history = await validateBalanceTransactionHistory(searchParams.history);
        } catch {
            history = [];
        }
    }

    let data;
    try {
        data = await Promise.all([
            mollieGetPrimaryBalance(),
            mollieGetBalanceTransactions({ from }),
        ]);
    } catch (error) {
        return (
            <main>
                <Flex direction="column" gap="4" m="6">
                    <Heading>Balances</Heading>
                    <Callout.Root color="red">
                        <Callout.Icon>
                            <InfoCircledIcon />
                        </Callout.Icon>
                        <Callout.Text>
                            Could not load balances: {(error as Error).message}
                        </Callout.Text>
                    </Callout.Root>
                </Flex>
            </main>
        );
    }
    const [balance, { transactions, nextPageCursor }] = data;

    return (
        <ViewTransition>
            <main>
                <Flex direction="column" gap="4" m="6">
                    <Heading>Balances</Heading>
                    <BalanceCard balance={balance} />
                    <Heading size="5" mt="4">Transactions</Heading>
                    <BalancesControls
                        currentFrom={from ?? null}
                        history={history}
                        nextCursor={nextPageCursor ?? null}
                    />
                    <BalanceTransactionsTable transactions={transactions} />
                </Flex>
            </main>
        </ViewTransition>
    );
}
