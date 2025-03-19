'use client';

import { Flex } from '@radix-ui/themes';
import { useEffect } from 'react';

import { createSessionPayment } from '@/app/lib/server-actions';

export default function SessionWrapper({ session }) {
    // Check if the Mollie object is available
    useEffect(() => {
        // Initialize the Mollie component
        const mollie = Mollie(session.clientAccessToken, { locale: 'en-US' });

        const expressComponent = mollie.create('express-checkout');
        expressComponent.mount(document.getElementById('express-component'));

        // on the 'paymentauthorized' event, redirect to the success URL
        expressComponent.on('paymentauthorized', async (data) => {
            try {
                await createSessionPayment(session.id);
            } catch (error) {
                // Handle error
            }
        });

        return () => {
            // Cleanup the Mollie component
            expressComponent.unmount();
        };
    }, [session.clientAccessToken, session.id]);

    return (
        <>
            <Flex
                align="center"
                justify="center"
                mt="4"
            >
                <Flex id="express-component"></Flex>
            </Flex>
        </>
    );
}
