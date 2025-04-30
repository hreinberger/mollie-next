'use client';

import { Flex, Heading, Callout, Button } from '@radix-ui/themes';
import Link from 'next/link';

import { useEffect } from 'react';

export default function Error({
    error,
}: {
    error: Error & { digest?: string };
}) {
    useEffect(() => {
        // Optionally log the error to an error reporting service
    }, [error]);

    return (
        <main>
            <Flex
                direction="column"
                m="6"
            >
                <Heading>💀 Error</Heading>
                <Flex
                    align="center"
                    justify="center"
                    mt="4"
                ></Flex>
                <Callout.Root
                    size="3"
                    color="red"
                >
                    <Callout.Text>{error.message}</Callout.Text>
                </Callout.Root>
                <Flex
                    justify="center"
                    mt="4"
                >
                    <Link href="/">
                        <Button variant="soft">Back to Checkout</Button>
                    </Link>
                </Flex>
            </Flex>
        </main>
    );
}
