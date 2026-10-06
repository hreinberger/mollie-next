import {
    Badge,
    Box,
    Card,
    Code,
    DataList,
    Flex,
    Text,
} from '@radix-ui/themes';
import Link from 'next/link';
import { mollieGetBalanceTransaction } from '@/app/lib/mollie';
import { contextId, formatAmount, formatDateTime } from '@/app/lib/format';
import RawJsonDump from './RawJsonDump';

export default async function BalanceTransactionOverview({
    id,
}: {
    id: string;
}) {
    const transaction = await mollieGetBalanceTransaction(id);
    const related = contextId(transaction.context);
    const negative = transaction.resultAmount.value.startsWith('-');

    return (
        <Flex direction="column" pt="4" gap="4">
            <Flex justify="center">
                <Box style={{ flex: 1, minWidth: 0, maxWidth: 560 }}>
                    <Card>
                        <DataList.Root>
                            <DataList.Item align="center">
                                <DataList.Label>ID</DataList.Label>
                                <DataList.Value>
                                    <Code variant="ghost">{transaction.id}</Code>
                                </DataList.Value>
                            </DataList.Item>
                            <DataList.Item>
                                <DataList.Label>Created At</DataList.Label>
                                <DataList.Value>
                                    {formatDateTime(transaction.createdAt)}
                                </DataList.Value>
                            </DataList.Item>
                            <DataList.Item>
                                <DataList.Label>Type</DataList.Label>
                                <DataList.Value>
                                    <Badge variant="soft">{transaction.type}</Badge>
                                </DataList.Value>
                            </DataList.Item>
                            <DataList.Item>
                                <DataList.Label>Result amount</DataList.Label>
                                <DataList.Value>
                                    <Text color={negative ? 'red' : undefined}>
                                        {formatAmount(transaction.resultAmount)}
                                    </Text>
                                </DataList.Value>
                            </DataList.Item>
                            <DataList.Item>
                                <DataList.Label>Initial amount</DataList.Label>
                                <DataList.Value>
                                    {formatAmount(transaction.initialAmount)}
                                </DataList.Value>
                            </DataList.Item>
                            {transaction.deductions && (
                                <DataList.Item>
                                    <DataList.Label>Deductions</DataList.Label>
                                    <DataList.Value>
                                        {formatAmount(transaction.deductions)}
                                    </DataList.Value>
                                </DataList.Item>
                            )}
                            {related && (
                                <DataList.Item>
                                    <DataList.Label>Related</DataList.Label>
                                    <DataList.Value>
                                        {related.startsWith('tr_') ? (
                                            <Link
                                                href={`/payments/${related}?mode=live`}
                                                className="underline"
                                            >
                                                {related}
                                            </Link>
                                        ) : (
                                            related
                                        )}
                                    </DataList.Value>
                                </DataList.Item>
                            )}
                        </DataList.Root>
                    </Card>
                </Box>
            </Flex>

            {/* ── Raw balance transaction data — own card at the bottom ── */}
            <RawJsonDump label="Raw Balance Transaction Data" data={transaction} />
        </Flex>
    );
}
