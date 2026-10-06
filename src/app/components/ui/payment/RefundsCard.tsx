import { Box, Card, Code, Flex, Heading, Separator, Table, Text, TextField } from '@radix-ui/themes';
import StateBadge from '../orderstatebadge';
import SubmitButton from '../submitbutton';
import { formatDateTime } from '@/app/lib/format';
import { refundPayment } from '@/app/lib/payment-actions';

type RefundRecord = {
    id: string;
    status: string;
    amount: { value: string; currency: string };
    createdAt: string;
};

export default function RefundsCard({
    id,
    mode,
    currency,
    remainingRefundable,
    canRefund,
    refunds,
}: {
    id: string;
    mode: 'test' | 'live';
    currency: string;
    remainingRefundable: string;
    canRefund: boolean;
    refunds: RefundRecord[];
}) {
    const boundRefundPayment = refundPayment.bind(null, id, mode, remainingRefundable, currency);

    return (
        <Card>
            <Heading size="3" mb="3">
                Refunds
            </Heading>

            {refunds.length > 0 && (
                <Box style={{ overflowX: 'auto' }}>
                    <Table.Root size="1" variant="ghost" style={{ minWidth: 360 }}>
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Amount</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Created</Table.ColumnHeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {refunds.map((refund) => (
                                <Table.Row key={refund.id}>
                                    <Table.Cell>
                                        <Code variant="ghost" size="1">
                                            {refund.id}
                                        </Code>
                                    </Table.Cell>
                                    <Table.Cell>
                                        {refund.amount.value} {refund.amount.currency}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <StateBadge state={refund.status} />
                                    </Table.Cell>
                                    <Table.Cell>
                                        {formatDateTime(refund.createdAt, 'short')}
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Box>
            )}

            {refunds.length === 0 && <Separator my="3" size="4" />}

            <Flex
                align="center"
                justify="between"
                mb="3"
                mt={refunds.length > 0 ? '3' : '0'}
            >
                <Text size="2" color="gray">
                    Remaining refundable:
                </Text>
                <Text size="2" weight="bold">
                    {remainingRefundable} {currency}
                </Text>
            </Flex>

            {canRefund && (
                <form
                    action={boundRefundPayment}
                    style={{ display: 'flex', justifyContent: 'flex-end' }}
                >
                    <Flex align="center" justify="end" gap="2">
                        <TextField.Root
                            type="number"
                            name="amount"
                            defaultValue={remainingRefundable}
                            min="0.01"
                            max={remainingRefundable}
                            step="0.01"
                            style={{ width: 100 }}
                        />
                        <Text size="2">{currency}</Text>
                        <SubmitButton label="Refund" color="orange" />
                    </Flex>
                </form>
            )}

            {!canRefund && parseFloat(remainingRefundable) === 0 && (
                <Text size="2" color="orange">
                    Fully refunded
                </Text>
            )}
        </Card>
    );
}
