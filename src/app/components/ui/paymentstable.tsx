import { Flex, Table, IconButton } from '@radix-ui/themes';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Payment } from '@mollie/api-client';
import Link from 'next/link';
import StateBadge from './orderstatebadge';
import PaymentLogo from '../form/paymentlogo';

export default function PaymentsTable({ payments }: { payments: Payment[] }) {
    return (
        <Flex justify="center" pt="4">
            <Table.Root
                variant="ghost"
                size={{ initial: '1', sm: '2', lg: '3' }}
                style={{ width: '100%' }}
            >
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>Method</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Timestamp</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Amount</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell className="hidden sm:table-cell">
                            Status
                        </Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell className="hidden md:table-cell">
                            Description
                        </Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell className="hidden lg:table-cell">
                            Payment ID
                        </Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Details</Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {payments.map((payment) => (
                        <Table.Row
                            key={payment.id}
                            className="hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                            <Table.Cell>
                                <Flex justify="center" align="center">
                                    {payment.method && (
                                        <PaymentLogo method={payment.method as string} />
                                    )}
                                </Flex>
                            </Table.Cell>
                            <Table.Cell>
                                {new Date(payment.createdAt).toLocaleString('de-DE', {
                                    dateStyle: 'medium',
                                    timeStyle: 'short',
                                })}
                            </Table.Cell>
                            <Table.Cell>
                                {payment.amount.currency} {payment.amount.value}
                            </Table.Cell>
                            <Table.Cell className="hidden sm:table-cell">
                                <StateBadge state={payment.status} />
                            </Table.Cell>
                            <Table.Cell className="hidden md:table-cell">
                                <div
                                    style={{
                                        maxWidth: '200px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                    title={payment.description ?? undefined}
                                >
                                    {payment.description}
                                </div>
                            </Table.Cell>
                            <Table.Cell className="hidden lg:table-cell">
                                {payment.id}
                            </Table.Cell>
                            <Table.Cell align="center">
                                <IconButton
                                    variant="outline"
                                    aria-label="Details"
                                    asChild
                                >
                                    <Link href={'/payments/' + payment.id}>
                                        <MagnifyingGlassIcon />
                                    </Link>
                                </IconButton>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </Flex>
    );
}
