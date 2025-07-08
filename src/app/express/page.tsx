import { Flex, Heading } from '@radix-ui/themes';
import { mollieCreateSession } from '../lib/mollie';
import SessionWrapper from './components/SessionWrapper';
import { ExpressSession } from '../lib/types';
import ShoppingCart from '../components/form/shoppingcart';

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
                        <ShoppingCart />
                        <SessionWrapper session={session} />
                    </Flex>
                </Flex>
            </Flex>
        </main>
    );
}
