import { Card, Flex, Text } from '@radix-ui/themes';
import { Payment } from '@mollie/api-client';
import Link from 'next/link';
import StateBadge from './orderstatebadge';
import PaymentLogo from '../form/paymentlogo';

export default function PaymentCards({ payments }: { payments: Payment[] }) {
    return (
        <Flex direction="column" gap="3" pt="4">
            {payments.map((payment) => (
                <Card key={payment.id} asChild>
                    <Link href={`/payments/${payment.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Flex justify="between" align="center">
                            <Flex align="center" gap="2">
                                {payment.method && (
                                    <PaymentLogo method={payment.method as string} />
                                )}
                                <Text size="2" color="gray">
                                    {payment.method ?? '—'}
                                </Text>
                            </Flex>
                            <StateBadge state={payment.status} />
                        </Flex>
                        <Flex justify="between" align="end" mt="2">
                            <Flex direction="column" gap="1">
                                <Text size="4" weight="bold">
                                    {payment.amount.currency} {payment.amount.value}
                                </Text>
                                <Text size="1" color="gray">
                                    {new Date(payment.createdAt).toLocaleString('de-DE', {
                                        dateStyle: 'medium',
                                        timeStyle: 'short',
                                    })}
                                </Text>
                            </Flex>
                            <Text size="1" color="gray">
                                {payment.id}
                            </Text>
                        </Flex>
                    </Link>
                </Card>
            ))}
        </Flex>
    );
}
