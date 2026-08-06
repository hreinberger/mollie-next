import { Flex, Heading, Skeleton } from '@radix-ui/themes';

export default function Loading() {
    return (
        <main>
            <Flex direction="column" m="6">
                <Heading>Payment Details</Heading>
                <Flex direction="column" gap="4" pt="4">
                    <Skeleton height="320px" />
                </Flex>
            </Flex>
        </main>
    );
}
