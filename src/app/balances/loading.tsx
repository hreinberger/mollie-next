import { Flex, Heading, Skeleton } from '@radix-ui/themes';

export default function Loading() {
    return (
        <main>
            <Flex direction="column" gap="4" m="6">
                <Heading>Balances</Heading>
                <Skeleton height="260px" />
                <Heading size="5" mt="4">Transactions</Heading>
                <Flex justify="end" gap="2">
                    <Skeleton height="32px" width="90px" />
                    <Skeleton height="32px" width="70px" />
                </Flex>
                <Skeleton height="640px" />
            </Flex>
        </main>
    );
}
