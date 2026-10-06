import { Box, Card, Code, DataList, Flex, Heading, Table, Text } from '@radix-ui/themes';
import { Payment } from '@mollie/api-client';
import StateBadge from '../orderstatebadge';
import PaymentLogo from '../../form/paymentlogo';
import { formatDateTime } from '@/app/lib/format';

type BillingAddress = {
    givenName?: string;
    familyName?: string;
    organizationName?: string;
    streetAndNumber?: string;
    postalCode?: string;
    city?: string;
    country?: string;
    email?: string;
};

type OrderLine = {
    id?: string;
    description: string;
    quantity: number;
    unitPrice: { value: string; currency: string };
    totalAmount: { value: string; currency: string };
};

// The payment details card: core fields, billing address, metadata, and
// order lines. The biggest single card on the payment detail page.
export default function DetailsCard({
    payment,
    billingAddress,
    lines,
    metadata,
}: {
    payment: Payment;
    billingAddress?: BillingAddress;
    lines?: OrderLine[];
    metadata?: Record<string, unknown>;
}) {
    const hasOrderLines = !!(lines && lines.length > 0);

    return (
        <Box style={{ flex: 1, minWidth: 0, maxWidth: 560 }}>
            <Card>
                <DataList.Root>
                    <DataList.Item align="center">
                        <DataList.Label>ID</DataList.Label>
                        <DataList.Value>
                            <Code variant="ghost">{payment.id}</Code>
                        </DataList.Value>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.Label>Created At</DataList.Label>
                        <DataList.Value>
                            {formatDateTime(payment.createdAt)}
                        </DataList.Value>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.Label>Amount</DataList.Label>
                        <DataList.Value>
                            {payment.amount.value} {payment.amount.currency}
                        </DataList.Value>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.Label>Description</DataList.Label>
                        <DataList.Value>{payment.description}</DataList.Value>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.Label>Status</DataList.Label>
                        <DataList.Value>
                            <StateBadge state={payment.status} />
                        </DataList.Value>
                    </DataList.Item>
                    <DataList.Item align="center">
                        <DataList.Label>Payment Method</DataList.Label>
                        <DataList.Value>
                            <Flex align="center" gap="2">
                                {payment.method && (
                                    <PaymentLogo method={payment.method as string} />
                                )}
                                <Code variant="ghost">{payment.method}</Code>
                            </Flex>
                        </DataList.Value>
                    </DataList.Item>
                    {billingAddress && (
                        <DataList.Item>
                            <DataList.Label>Billing Address</DataList.Label>
                            <DataList.Value>
                                <Flex direction="column" gap="1">
                                    {(billingAddress.givenName ||
                                        billingAddress.familyName) && (
                                        <Text size="2">
                                            {[
                                                billingAddress.givenName,
                                                billingAddress.familyName,
                                            ]
                                                .filter(Boolean)
                                                .join(' ')}
                                        </Text>
                                    )}
                                    {billingAddress.organizationName && (
                                        <Text size="2" color="gray">
                                            {billingAddress.organizationName}
                                        </Text>
                                    )}
                                    {billingAddress.streetAndNumber && (
                                        <Text size="2">
                                            {billingAddress.streetAndNumber}
                                        </Text>
                                    )}
                                    {(billingAddress.postalCode ||
                                        billingAddress.city) && (
                                        <Text size="2">
                                            {[
                                                billingAddress.postalCode,
                                                billingAddress.city,
                                            ]
                                                .filter(Boolean)
                                                .join(' ')}
                                        </Text>
                                    )}
                                    {billingAddress.country && (
                                        <Text size="2">{billingAddress.country}</Text>
                                    )}
                                    {billingAddress.email && (
                                        <Text size="2" color="gray">
                                            {billingAddress.email}
                                        </Text>
                                    )}
                                </Flex>
                            </DataList.Value>
                        </DataList.Item>
                    )}
                    {metadata && Object.keys(metadata).length > 0 && (
                        <DataList.Item>
                            <DataList.Label>Metadata</DataList.Label>
                            <DataList.Value>
                                <Text size="1">
                                    <pre style={{ margin: 0 }}>
                                        {JSON.stringify(metadata, null, 2)}
                                    </pre>
                                </Text>
                            </DataList.Value>
                        </DataList.Item>
                    )}
                </DataList.Root>

                {/* Order lines — heading gives visual break; no Separator before it
                    to avoid doubling with the table's own bottom row border. */}
                {hasOrderLines && (
                    <>
                        <Heading size="2" mt="4" mb="2">
                            Order Lines
                        </Heading>
                        <Box style={{ overflowX: 'auto' }}>
                            <Table.Root size="1" variant="ghost" style={{ minWidth: 360 }}>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.ColumnHeaderCell>
                                            Description
                                        </Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Qty</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>
                                            Unit Price
                                        </Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Total</Table.ColumnHeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {lines!.map((line, i) => (
                                        <Table.Row key={line.id ?? i}>
                                            <Table.Cell>{line.description}</Table.Cell>
                                            <Table.Cell>{line.quantity}</Table.Cell>
                                            <Table.Cell>
                                                {line.unitPrice.value}{' '}
                                                {line.unitPrice.currency}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {line.totalAmount.value}{' '}
                                                {line.totalAmount.currency}
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        </Box>
                    </>
                )}
            </Card>
        </Box>
    );
}
