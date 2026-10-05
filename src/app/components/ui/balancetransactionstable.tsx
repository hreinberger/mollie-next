import { Badge, Flex, IconButton, Table, Text } from '@radix-ui/themes';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { BalanceTransaction } from '@/app/lib/types';

// The context object holds the related resource, e.g. { paymentId: 'tr_…' }.
function contextId(context?: Record<string, unknown>) {
    if (!context) return undefined;
    const value = Object.values(context).find(
        (v) => typeof v === 'string' && /^[a-z]+_/.test(v),
    );
    return value as string | undefined;
}

export default function BalanceTransactionsTable({
    transactions,
}: {
    transactions: BalanceTransaction[];
}) {
    return (
        <Flex justify="center" pt="4">
            <Table.Root
                variant="ghost"
                size={{ initial: '1', sm: '2', lg: '3' }}
                style={{ width: '100%' }}
            >
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>Timestamp</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Amount</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell className="hidden sm:table-cell">
                            Initial amount
                        </Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell className="hidden md:table-cell">
                            Related
                        </Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Details</Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {transactions.map((tx) => {
                        const related = contextId(tx.context);
                        const negative = tx.resultAmount.value.startsWith('-');
                        return (
                            <Table.Row
                                key={tx.id}
                                className="hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            >
                                <Table.Cell>
                                    {new Date(tx.createdAt).toLocaleString('de-DE', {
                                        dateStyle: 'medium',
                                        timeStyle: 'short',
                                    })}
                                </Table.Cell>
                                <Table.Cell>
                                    <Badge variant="soft">{tx.type}</Badge>
                                </Table.Cell>
                                <Table.Cell>
                                    <Text color={negative ? 'red' : undefined}>
                                        {tx.resultAmount.currency} {tx.resultAmount.value}
                                    </Text>
                                </Table.Cell>
                                <Table.Cell className="hidden sm:table-cell">
                                    {tx.initialAmount.currency} {tx.initialAmount.value}
                                </Table.Cell>
                                <Table.Cell className="hidden md:table-cell">
                                    {related?.startsWith('tr_') ? (
                                        <Link
                                            href={`/payments/${related}?mode=live`}
                                            className="underline"
                                        >
                                            {related}
                                        </Link>
                                    ) : (
                                        related ?? '—'
                                    )}
                                </Table.Cell>
                                <Table.Cell align="center">
                                    <IconButton
                                        variant="outline"
                                        aria-label="Details"
                                        asChild
                                    >
                                        <Link href={`/balances/transactions/${tx.id}`}>
                                            <MagnifyingGlassIcon />
                                        </Link>
                                    </IconButton>
                                </Table.Cell>
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table.Root>
        </Flex>
    );
}
