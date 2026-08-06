import { Flex, Heading, Skeleton } from '@radix-ui/themes';

export default function Loading() {
    return (
        <main>
            <Flex
                direction="column"
                gap="4"
                m="6"
            >
                <Heading>Recent Payments</Heading>
                <Flex
                    justify="between"
                    align="center"
                >
                    <Skeleton
                        height="24px"
                        width="140px"
                    />
                    <Flex gap="2">
                        <Skeleton
                            height="32px"
                            width="90px"
                        />
                        <Skeleton
                            height="32px"
                            width="70px"
                        />
                    </Flex>
                </Flex>
                <Skeleton height="640px" />
            </Flex>
        </main>
    );
}
