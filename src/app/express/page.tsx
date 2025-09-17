import { Flex, Heading, Text } from '@radix-ui/themes';
import { mollieCreateSession } from '../lib/mollie';
import SessionWrapper from './components/SessionWrapper';
import { ExpressSession } from '../lib/types';
import ShoppingCart from '../components/form/shoppingcart';
import { Suspense } from 'react';

export default async function Page() {
    const { sessionId, clientAccessToken } = await mollieCreateSession();
    const session: ExpressSession = { id: sessionId, clientAccessToken };

    return (
        <main>
            <Flex
                direction="column"
                m="6"
            >
                <Heading>Express Components</Heading>
                <Flex
                    align="center"
                    justify="center"
                    mt="4"
                >
                    <Flex
                        direction="column"
                        align="stretch"
                        gap="4"
                    >
                        <Suspense fallback={<div>⏳</div>}>
                            <ShoppingCart />
                        </Suspense>
                        <Flex justify="center">
                            <Text>Pay now with</Text>
                        </Flex>
                        <SessionWrapper session={session} />
                    </Flex>
                </Flex>
            </Flex>
        </main>
    );
}
