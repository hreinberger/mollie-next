import { Box, Card, Code, Flex, Heading, Separator, Table, Text, TextField } from '@radix-ui/themes';
import StateBadge from '../orderstatebadge';
import SubmitButton from '../submitbutton';
import { formatDateTime } from '@/app/lib/format';
import { capturePayment, releaseAuthorization } from '@/app/lib/payment-actions';

type CaptureRecord = {
    id: string;
    status: string;
    amount: { value: string; currency: string };
    createdAt: string;
};

export default function CapturesCard({
    id,
    mode,
    currency,
    remaining,
    canCapture,
    captures,
}: {
    id: string;
    mode: 'test' | 'live';
    currency: string;
    remaining: string;
    canCapture: boolean;
    captures: CaptureRecord[];
}) {
    const boundCapturePayment = capturePayment.bind(null, id, mode, remaining, currency);
    const boundReleaseAuthorization = releaseAuthorization.bind(null, id, mode);

    return (
        <Card>
            <Heading size="3" mb="3">
                Captures
            </Heading>

            {captures.length > 0 && (
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
                            {captures.map((capture) => (
                                <Table.Row key={capture.id}>
                                    <Table.Cell>
                                        <Code variant="ghost" size="1">
                                            {capture.id}
                                        </Code>
                                    </Table.Cell>
                                    <Table.Cell>
                                        {capture.amount.value} {capture.amount.currency}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <StateBadge state={capture.status} />
                                    </Table.Cell>
                                    <Table.Cell>
                                        {formatDateTime(capture.createdAt, 'short')}
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Box>
            )}

            {captures.length === 0 && <Separator my="3" size="4" />}

            {canCapture ? (
                <Box mt={captures.length > 0 ? '3' : '0'}>
                    <Flex align="center" justify="between" mb="3">
                        <Text size="2" color="gray">
                            Remaining capturable:
                        </Text>
                        <Text size="2" weight="bold">
                            {remaining} {currency}
                        </Text>
                    </Flex>
                    <Flex direction="column" gap="2">
                        <form
                            action={boundCapturePayment}
                            style={{ display: 'flex', justifyContent: 'flex-end' }}
                        >
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
                                <Text size="2">{currency}</Text>
                                <SubmitButton label="Capture" color="green" />
                            </Flex>
                        </form>
                        <Separator size="4" />
                        <form action={boundReleaseAuthorization}>
                            <Flex justify="end">
                                <SubmitButton label="Release authorization" color="red" />
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
    );
}
