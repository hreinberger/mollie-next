import { Badge, Card, DataList, Flex, Heading, Text } from '@radix-ui/themes';
import { Balance } from '@/app/lib/types';

function formatAmount(amount?: { value: string; currency: string }) {
    return amount ? `${amount.currency} ${amount.value}` : '—';
}

export default function BalanceCard({ balance }: { balance: Balance }) {
    return (
        <Card size="3">
            <Flex direction="column" gap="4">
                <Flex justify="between" align="center">
                    <Heading size="4">Primary balance</Heading>
                    <Badge color={balance.status === 'active' ? 'green' : 'gray'}>
                        {balance.status}
                    </Badge>
                </Flex>
                <Flex gap="6" wrap="wrap">
                    <Flex direction="column">
                        <Text size="2" color="gray">Available</Text>
                        <Text size="7" weight="bold">
                            {formatAmount(balance.availableAmount)}
                        </Text>
                    </Flex>
                    <Flex direction="column">
                        <Text size="2" color="gray">Pending</Text>
                        <Text size="7" weight="bold">
                            {formatAmount(balance.pendingAmount)}
                        </Text>
                    </Flex>
                </Flex>
                <DataList.Root size="2">
                    <DataList.Item>
                        <DataList.Label>Balance ID</DataList.Label>
                        <DataList.Value>{balance.id}</DataList.Value>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.Label>Currency</DataList.Label>
                        <DataList.Value>{balance.currency}</DataList.Value>
                    </DataList.Item>
                </DataList.Root>
            </Flex>
        </Card>
    );
}
