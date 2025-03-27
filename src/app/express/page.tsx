import { Flex, Heading } from '@radix-ui/themes';
import { mollieCreateSession } from '../lib/mollie';
import SessionWrapper from './components/SessionWrapper';
import { ExpressSession } from '../lib/types';
import Script from 'next/script';

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
                    <SessionWrapper session={session} />
                </Flex>
            </Flex>
            <Script
                src="https://js.mollie.com/v2/mollie.js"
                strategy="beforeInteractive"
            />
        </main>
    );
}
