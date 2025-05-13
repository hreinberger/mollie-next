'use client';

import { Flex } from '@radix-ui/themes';
import { useEffect } from 'react';

import { createSessionPayment } from '@/app/lib/server-actions';

export default function SessionWrapper({ session }) {
    useEffect(() => {
        let expressComponent; // Define here to ensure it's in scope for cleanup

        if (typeof window === 'undefined' || !window.Mollie2) {
            console.error('Mollie2 object is not available on window.');
            return;
        }

        if (!session || !session.clientAccessToken) {
            console.error('Mollie session or clientAccessToken is missing.');
            return;
        }

        try {
            const mollieInstance = window.Mollie2(session.clientAccessToken, {
                locale: 'en-US',
            });

            if (
                !mollieInstance ||
                typeof mollieInstance.create !== 'function'
            ) {
                console.error(
                    'Failed to initialize Mollie instance or `create` method is missing.'
                );
                return;
            }

            expressComponent = mollieInstance.create('express-checkout');

            if (
                !expressComponent ||
                typeof expressComponent.mount !== 'function' ||
                typeof expressComponent.on !== 'function' ||
                typeof expressComponent.unmount !== 'function'
            ) {
                console.error(
                    'Mollie express component is invalid or missing required methods.'
                );
                expressComponent = null; // Ensure it's null if invalid
                return;
            }

            const mountPoint = document.getElementById('express-component');
            if (!mountPoint) {
                console.error(
                    'Mount point #express-component not found in the DOM.'
                );
                expressComponent = null; // Ensure it's null if mount point is missing
                return;
            }

            expressComponent.mount(mountPoint);

            const handlePaymentAuthorized = async (data) => {
                try {
                    console.log(
                        'Payment authorized, creating session payment...',
                        data
                    );
                    await createSessionPayment(session.id);
                    console.log('Session payment creation attempted.');
                } catch (error) {
                    console.error(
                        'Error processing payment authorization:',
                        error
                    );
                }
            };

            expressComponent.on('paymentauthorized', handlePaymentAuthorized);
        } catch (error) {
            console.error('Error during Mollie component setup:', error);
            // If setup fails, ensure expressComponent is not set or is null
            // so cleanup doesn't try to unmount a partially initialized component.
            expressComponent = null;
        }

        return () => {
            if (
                expressComponent &&
                typeof expressComponent.unmount === 'function'
            ) {
                console.log(
                    'Attempting to unmount Mollie express component...'
                );
                try {
                    expressComponent.unmount();
                    console.log(
                        'Mollie express component unmounted successfully.'
                    );
                } catch (unmountError) {
                    // This is where "Cannot read properties of undefined (reading 'destroy')" would be caught
                    console.error(
                        'Error during Mollie component unmount:',
                        unmountError
                    );
                }
            } else {
                console.log(
                    'Mollie express component was not available or unmount is not a function during cleanup.'
                );
            }
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
