'use client';

import { Flex } from '@radix-ui/themes';
import { useEffect } from 'react';

export default function MethodsWrapperV2({ session }) {
    useEffect(() => {
        let methodsComponent;

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

            methodsComponent = checkout.create('methods-component');
            methodsComponent.mount(document.getElementById('methods-component'));
        } catch (error) {
            console.error('Methods v2 component error:', error);
        }

        return () => {
            if (methodsComponent?.unmount) {
                try {
                    methodsComponent.unmount();
                } catch (e) {
                    console.error('Methods v2 unmount error:', e);
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
            <div id="methods-component" style={{ width: '100%' }} />
        </Flex>
    );
}
