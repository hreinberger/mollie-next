import { Flex, Heading, Grid, Skeleton } from '@radix-ui/themes';

export default function Loading() {
    return (
        <main>
            <Flex
                direction="column"
                m="6"
            >
                <Heading mb="4">Checkout</Heading>
                <Grid
                    pt="2"
                    columns={{ initial: '1', md: '2' }}
                    gap="5"
                    gapY="6"
                >
                    <Flex
                        direction="column"
                        gap="2"
                    >
                        <Skeleton
                            height="24px"
                            width="160px"
                        />
                        <Skeleton height="420px" />
                    </Flex>
                    <Flex
                        direction="column"
                        gap="2"
                    >
                        <Skeleton
                            height="24px"
                            width="160px"
                        />
                        <Skeleton height="280px" />
                        <Skeleton
                            height="24px"
                            width="100px"
                        />
                        <Skeleton height="420px" />
                    </Flex>
                </Grid>
            </Flex>
        </main>
    );
}
