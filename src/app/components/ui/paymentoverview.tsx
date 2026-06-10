'use server';

// UI Components
import {
    Flex,
    Box,
    Code,
    Card,
    DataList,
    Separator,
    ScrollArea,
    Text,
    Table,
    Heading,
    TextField,
} from '@radix-ui/themes';
import StateBadge from './orderstatebadge';

// Routing
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Mollie API
import {
    mollieGetPayment,
    mollieCapturePayment,
    mollieRefundPayment,
    mollieReleaseAuthorization,
} from '@/app/lib/mollie';
import { validateCaptureAmount } from '@/app/lib/validation';
import { Payment } from '@mollie/api-client';
import PaymentLogo from '../form/paymentlogo';
import SubmitButton from './submitbutton';

type CaptureRecord = {
    id: string;
    status: string;
    amount: { value: string; currency: string };
    createdAt: string;
};

type RefundRecord = {
    id: string;
    status: string;
    amount: { value: string; currency: string };
    createdAt: string;
};

type PaymentWithEmbedded = Payment & {
    _embedded?: {
        captures?: CaptureRecord[];
        refunds?: RefundRecord[];
    };
};

export default async function PaymentOverview({
    id,
    mode,
}: {
    id: string;
    mode: 'test' | 'live';
}) {
    const payment = (await mollieGetPayment(id, mode)) as PaymentWithEmbedded;
    const captures: CaptureRecord[] = payment._embedded?.captures ?? [];
    const refunds: RefundRecord[] = payment._embedded?.refunds ?? [];

    // amountRemaining is present once any capture/refund activity has occurred.
    // For a fresh authorized payment it is absent, so fall back to amount − amountCaptured.
    const remaining =
        payment.amountRemaining?.value ??
        Math.max(
            0,
            parseFloat(payment.amount.value) -
                parseFloat(payment.amountCaptured?.value ?? '0'),
        ).toFixed(2);
    const remainingRefundable = payment.amountRemaining?.value ?? '0.00';

    const canCapture =
        payment.status === 'authorized' && parseFloat(remaining) > 0;
    const showCapturesSection =
        payment.status === 'authorized' || captures.length > 0;

    const canRefund =
        payment.status === 'paid' && parseFloat(remainingRefundable) > 0;
    const showRefundsSection =
        payment.status === 'paid' || refunds.length > 0;

    const billingAddress = (payment as any).billingAddress as
        | {
              givenName?: string;
              familyName?: string;
              organizationName?: string;
              streetAndNumber?: string;
              postalCode?: string;
              city?: string;
              country?: string;
              email?: string;
          }
        | undefined;

    const lines = (payment as any).lines as
        | Array<{
              id?: string;
              description: string;
              quantity: number;
              unitPrice: { value: string; currency: string };
              totalAmount: { value: string; currency: string };
          }>
        | undefined;

    const metadata = (payment as any).metadata as
        | Record<string, unknown>
        | undefined;

    const hasOrderLines = !!(lines && lines.length > 0);

    async function capturePayment(formData: FormData) {
        'use server';
        const rawAmount = formData.get('amount') as string;
        const validated = await validateCaptureAmount(
            rawAmount,
            remaining,
        );
        await mollieCapturePayment(id, mode, {
            value: validated,
            currency: payment.amount.currency,
        });
        revalidatePath('/payments/' + id);
        redirect('/payments/' + id + '?mode=' + mode);
    }

    async function releaseAuthorization() {
        'use server';
        await mollieReleaseAuthorization(id, mode);
        revalidatePath('/payments/' + id);
        redirect('/payments/' + id + '?mode=' + mode);
    }

    async function refundPayment(formData: FormData) {
        'use server';
        const rawAmount = formData.get('amount') as string;
        const validated = await validateCaptureAmount(
            rawAmount,
            remainingRefundable,
        );
        await mollieRefundPayment(id, mode, {
            value: validated,
            currency: payment.amount.currency,
        });
        revalidatePath('/payments/' + id);
        redirect('/payments/' + id + '?mode=' + mode);
    }

    return (
        <Flex direction="column" pt="4" gap="4">

            {/* ── Row 1: Details card + Captures card side by side on desktop ── */}
            <Flex
                direction={{ initial: 'column', md: 'row' }}
                gap="4"
                align={{ initial: 'stretch', md: 'start' }}
                justify="center"
            >
                {/* Details card */}
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
                                    {new Date(payment.createdAt).toLocaleString(
                                        'de-DE',
                                        {
                                            dateStyle: 'medium',
                                            timeStyle: 'short',
                                        },
                                    )}
                                </DataList.Value>
                            </DataList.Item>
                            <DataList.Item>
                                <DataList.Label>Amount</DataList.Label>
                                <DataList.Value>
                                    {payment.amount.value}{' '}
                                    {payment.amount.currency}
                                </DataList.Value>
                            </DataList.Item>
                            <DataList.Item>
                                <DataList.Label>Description</DataList.Label>
                                <DataList.Value>
                                    {payment.description}
                                </DataList.Value>
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
                                            <PaymentLogo
                                                method={payment.method as string}
                                            />
                                        )}
                                        <Code variant="ghost">
                                            {payment.method}
                                        </Code>
                                    </Flex>
                                </DataList.Value>
                            </DataList.Item>
                            {billingAddress && (
                                <DataList.Item>
                                    <DataList.Label>
                                        Billing Address
                                    </DataList.Label>
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
                                                    {
                                                        billingAddress.organizationName
                                                    }
                                                </Text>
                                            )}
                                            {billingAddress.streetAndNumber && (
                                                <Text size="2">
                                                    {
                                                        billingAddress.streetAndNumber
                                                    }
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
                                                <Text size="2">
                                                    {billingAddress.country}
                                                </Text>
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
                                                {JSON.stringify(
                                                    metadata,
                                                    null,
                                                    2,
                                                )}
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
                                    <Table.Root
                                        size="1"
                                        variant="ghost"
                                        style={{ minWidth: 360 }}
                                    >
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.ColumnHeaderCell>
                                                    Description
                                                </Table.ColumnHeaderCell>
                                                <Table.ColumnHeaderCell>
                                                    Qty
                                                </Table.ColumnHeaderCell>
                                                <Table.ColumnHeaderCell>
                                                    Unit Price
                                                </Table.ColumnHeaderCell>
                                                <Table.ColumnHeaderCell>
                                                    Total
                                                </Table.ColumnHeaderCell>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {lines!.map((line, i) => (
                                                <Table.Row key={line.id ?? i}>
                                                    <Table.Cell>
                                                        {line.description}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {line.quantity}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {line.unitPrice.value}{' '}
                                                        {line.unitPrice.currency}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {line.totalAmount.value}{' '}
                                                        {
                                                            line.totalAmount
                                                                .currency
                                                        }
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

                {/* Right column: Captures + Refunds stacked */}
                {(showCapturesSection || showRefundsSection) && (
                    <Flex
                        direction="column"
                        gap="4"
                        style={{ flex: 1, minWidth: 0, maxWidth: 560 }}
                    >
                        {/* Captures card */}
                        {showCapturesSection && (
                            <Card>
                                <Heading size="3" mb="3">
                                    Captures
                                </Heading>

                                {captures.length > 0 && (
                                    <Box style={{ overflowX: 'auto' }}>
                                        <Table.Root
                                            size="1"
                                            variant="ghost"
                                            style={{ minWidth: 360 }}
                                        >
                                            <Table.Header>
                                                <Table.Row>
                                                    <Table.ColumnHeaderCell>
                                                        ID
                                                    </Table.ColumnHeaderCell>
                                                    <Table.ColumnHeaderCell>
                                                        Amount
                                                    </Table.ColumnHeaderCell>
                                                    <Table.ColumnHeaderCell>
                                                        Status
                                                    </Table.ColumnHeaderCell>
                                                    <Table.ColumnHeaderCell>
                                                        Created
                                                    </Table.ColumnHeaderCell>
                                                </Table.Row>
                                            </Table.Header>
                                            <Table.Body>
                                                {captures.map((capture) => (
                                                    <Table.Row key={capture.id}>
                                                        <Table.Cell>
                                                            <Code
                                                                variant="ghost"
                                                                size="1"
                                                            >
                                                                {capture.id}
                                                            </Code>
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {
                                                                capture.amount
                                                                    .value
                                                            }{' '}
                                                            {
                                                                capture.amount
                                                                    .currency
                                                            }
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <StateBadge
                                                                state={
                                                                    capture.status
                                                                }
                                                            />
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {new Date(
                                                                capture.createdAt,
                                                            ).toLocaleString(
                                                                'de-DE',
                                                                {
                                                                    dateStyle:
                                                                        'short',
                                                                    timeStyle:
                                                                        'short',
                                                                },
                                                            )}
                                                        </Table.Cell>
                                                    </Table.Row>
                                                ))}
                                            </Table.Body>
                                        </Table.Root>
                                    </Box>
                                )}

                                {captures.length === 0 && (
                                    <Separator my="3" size="4" />
                                )}

                                {canCapture ? (
                                    <Box mt={captures.length > 0 ? '3' : '0'}>
                                        <Flex
                                            align="center"
                                            justify="between"
                                            mb="3"
                                        >
                                            <Text size="2" color="gray">
                                                Remaining capturable:
                                            </Text>
                                            <Text size="2" weight="bold">
                                                {remaining}{' '}
                                                {payment.amount.currency}
                                            </Text>
                                        </Flex>
                                        <Flex direction="column" gap="2">
                                            <form action={capturePayment} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                <Flex align="center" justify="end" gap="2">
                                                    <TextField.Root
                                                        type="number"
                                                        name="amount"
                                                        defaultValue={remaining}
                                                        min="0.01"
                                                        max={remaining}
                                                        step="0.01"
                                                        style={{ width: 100 }}
                                                    />
                                                    <Text size="2">
                                                        {
                                                            payment.amount
                                                                .currency
                                                        }
                                                    </Text>
                                                    <SubmitButton
                                                        label="Capture"
                                                        color="green"
                                                    />
                                                </Flex>
                                            </form>
                                            <Separator size="4" />
                                            <form action={releaseAuthorization}>
                                                <Flex justify="end">
                                                    <SubmitButton
                                                        label="Release authorization"
                                                        color="red"
                                                    />
                                                </Flex>
                                            </form>
                                        </Flex>
                                    </Box>
                                ) : (
                                    <Box mt={captures.length > 0 ? '3' : '0'}>
                                        <Text size="2" color="green">
                                            Fully captured
                                        </Text>
                                    </Box>
                                )}
                            </Card>
                        )}

                        {/* Refunds card */}
                        {showRefundsSection && (
                            <Card>
                                <Heading size="3" mb="3">
                                    Refunds
                                </Heading>

                                {refunds.length > 0 && (
                                    <Box style={{ overflowX: 'auto' }}>
                                        <Table.Root
                                            size="1"
                                            variant="ghost"
                                            style={{ minWidth: 360 }}
                                        >
                                            <Table.Header>
                                                <Table.Row>
                                                    <Table.ColumnHeaderCell>
                                                        ID
                                                    </Table.ColumnHeaderCell>
                                                    <Table.ColumnHeaderCell>
                                                        Amount
                                                    </Table.ColumnHeaderCell>
                                                    <Table.ColumnHeaderCell>
                                                        Status
                                                    </Table.ColumnHeaderCell>
                                                    <Table.ColumnHeaderCell>
                                                        Created
                                                    </Table.ColumnHeaderCell>
                                                </Table.Row>
                                            </Table.Header>
                                            <Table.Body>
                                                {refunds.map((refund) => (
                                                    <Table.Row key={refund.id}>
                                                        <Table.Cell>
                                                            <Code
                                                                variant="ghost"
                                                                size="1"
                                                            >
                                                                {refund.id}
                                                            </Code>
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {
                                                                refund.amount
                                                                    .value
                                                            }{' '}
                                                            {
                                                                refund.amount
                                                                    .currency
                                                            }
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <StateBadge
                                                                state={
                                                                    refund.status
                                                                }
                                                            />
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {new Date(
                                                                refund.createdAt,
                                                            ).toLocaleString(
                                                                'de-DE',
                                                                {
                                                                    dateStyle:
                                                                        'short',
                                                                    timeStyle:
                                                                        'short',
                                                                },
                                                            )}
                                                        </Table.Cell>
                                                    </Table.Row>
                                                ))}
                                            </Table.Body>
                                        </Table.Root>
                                    </Box>
                                )}

                                {refunds.length === 0 && (
                                    <Separator my="3" size="4" />
                                )}

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
                                        {remainingRefundable}{' '}
                                        {payment.amount.currency}
                                    </Text>
                                </Flex>

                                {canRefund && (
                                    <form action={refundPayment} style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
                                            <Text size="2">
                                                {payment.amount.currency}
                                            </Text>
                                            <SubmitButton
                                                label="Refund"
                                                color="orange"
                                            />
                                        </Flex>
                                    </form>
                                )}

                                {!canRefund &&
                                    parseFloat(remainingRefundable) === 0 && (
                                        <Text size="2" color="orange">
                                            Fully refunded
                                        </Text>
                                    )}
                            </Card>
                        )}
                    </Flex>
                )}
            </Flex>

            {/* ── Row 2: Raw payment data — own card at the bottom ── */}
            <Card>
                <details>
                    <summary style={{ cursor: 'pointer', userSelect: 'none' }}>
                        <Text size="3" weight="bold">
                            Raw Payment Data
                        </Text>
                    </summary>
                    <Box
                        mt="3"
                        p="3"
                        style={{
                            background: 'var(--gray-a2)',
                            borderRadius: 'var(--radius-2)',
                        }}
                    >
                        <ScrollArea style={{ maxHeight: 600 }}>
                            <Text size="1">
                                <pre
                                    style={{
                                        margin: 0,
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {JSON.stringify(payment, null, 2)}
                                </pre>
                            </Text>
                        </ScrollArea>
                    </Box>
                </details>
            </Card>

        </Flex>
    );
}
