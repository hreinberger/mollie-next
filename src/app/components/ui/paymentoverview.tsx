'use server';

// UI Components

import {
    Flex,
    Code,
    Card,
    DataList,
    Button,
    Separator,
    Dialog,
    ScrollArea,
    Text,
    Heading,
} from '@radix-ui/themes';
import StateBadge from './orderstatebadge';

// Routing
import Link from 'next/link';

// Mollie API
import { mollieGetPayment } from '@/app/lib/mollie';
import { Payment } from '@mollie/api-client';

export default async function PaymentOverview({ id }: { id: string }) {
    const payment: Payment = await mollieGetPayment(id);
    return (
        <Flex
            justify="center"
            pt="4"
        >
            <Flex>
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
                                    }
                                )}
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.Label>amount</DataList.Label>
                            <DataList.Value>
                                {payment.amount.value} {payment.amount.currency}
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
                                <Code variant="ghost">{payment.method}</Code>
                            </DataList.Value>
                        </DataList.Item>
                    </DataList.Root>
                    <Separator
                        my="3"
                        size="4"
                    />
                    <Flex
                        justify="center"
                        align="center"
                        gap="2"
                    >
                        <Link href={payment._links.dashboard.href}>
                            <Button
                                size="1"
                                variant="soft"
                            >
                                Mollie Dashboard
                            </Button>
                        </Link>
                        <Dialog.Root>
                            <Dialog.Trigger>
                                <Button
                                    size="1"
                                    variant="soft"
                                >
                                    Raw Payment Data
                                </Button>
                            </Dialog.Trigger>
                            <Dialog.Content>
                                <Dialog.Title>Raw Payment Data</Dialog.Title>
                                <Separator
                                    my="2"
                                    size="4"
                                />
                                <ScrollArea style={{ height: 480 }}>
                                    <Text size="1">
                                        <pre>
                                            {JSON.stringify(payment, null, 2)}
                                        </pre>
                                    </Text>
                                </ScrollArea>
                            </Dialog.Content>
                        </Dialog.Root>
                        {payment._links.changePaymentState && (
                            <Link href={payment._links.changePaymentState.href}>
                                <Button
                                    size="1"
                                    color="red"
                                    variant="soft"
                                >
                                    Change State
                                </Button>
                            </Link>
                        )}
                    </Flex>
                </Card>
            </Flex>
        </Flex>
    );
}
