'use client';

import { Flex } from '@radix-ui/themes';
import { useEffect } from 'react';

export default function CardWrapperV2({ session }) {
    useEffect(() => {
        let cardComponent;

        if (typeof window === 'undefined' || !window.Mollie2) {
            console.error('Mollie2 is not available on window.');
            return;
        }

        if (!session?.clientAccessToken) {
            console.error('Session or clientAccessToken is missing.');
            return;
        }

        try {
            const checkout = window.Mollie2.Checkout(
                session.clientAccessToken,
                { locale: 'en-US' }
            );

            cardComponent = checkout.create('card');
            cardComponent.mount(document.getElementById('mollie-component'));
        } catch (error) {
            console.error('Card v2 component error:', error);
        }

        return () => {
            if (cardComponent?.unmount) {
                try {
                    cardComponent.unmount();
                } catch (e) {
                    console.error('Card v2 unmount error:', e);
                }
            }
        };
    }, [session]);

    return (
        <Flex
            align="center"
            justify="center"
            mt="4"
        >
            <div id="mollie-component" style={{ width: '100%' }} />
        </Flex>
    );
}
