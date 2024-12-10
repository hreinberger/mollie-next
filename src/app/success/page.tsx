'use client';

import { RocketIcon } from '@radix-ui/react-icons';
import { Callout, Flex, Heading, Em } from '@radix-ui/themes';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
    const router = useRouter();
    // Redirect to checkout after 7 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/checkout');
        }, 7000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <main>
            <Flex
                direction="column"
                m="6"
            >
                <Heading>Success</Heading>
                <Flex
                    align="center"
                    justify="center"
                    mt="4"
                >
                    <Callout.Root
                        size="3"
                        color="green"
                    >
                        <Callout.Icon>
                            <RocketIcon />
                        </Callout.Icon>
                        <Callout.Text>
                            Thank you for your payment! You'll be redirected to
                            the checkout soon to pay <Em>even more!</Em>
                        </Callout.Text>
                    </Callout.Root>
                </Flex>
            </Flex>
        </main>
    );
}
