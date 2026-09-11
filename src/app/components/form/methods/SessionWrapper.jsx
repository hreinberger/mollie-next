'use client';

import { Flex } from '@radix-ui/themes';
import { useEffect } from 'react';

/**
 * SessionWrapper mounts a Mollie Express Checkout component.
 *
 * Express Components flow:
 *  1. The server creates a Mollie Session (via mollieCreateSession) and passes
 *     the clientAccessToken down to this component as part of the `session` prop.
 *  2. We initialize a Mollie2 Checkout instance using that token.
 *  3. We create an 'express-component' component and mount it to the DOM.
 *  4. The component renders the payment buttons (e.g. Apple Pay, Google Pay).
 *  5. Once the buyer confirms a payment method, the Session creates the Payment
 *     automatically — there is no client- or server-side "create payment" call
 *     to make. The buyer is then redirected to the session's redirectUrl.
 */
export default function SessionWrapper({ session }) {
    useEffect(() => {
        // These are defined outside try so they're accessible in the cleanup function.
        let expressComponent;
        let checkout;

        // Mollie2 is loaded via next/script (beforeInteractive) in layout.tsx.
        if (typeof window === 'undefined' || !window.Mollie2) {
            console.error('Mollie2 object is not available on window.');
            return;
        }

        if (!session || !session.clientAccessToken) {
            console.error('Mollie session or clientAccessToken is missing.');
            return;
        }

        try {
            // Step 1: Create a Checkout instance authenticated with the session token.
            checkout = window.Mollie2.Checkout(session.clientAccessToken, {
                locale: 'en-US',
            });

            if (!checkout || typeof checkout.create !== 'function') {
                console.error(
                    'Failed to initialize Mollie Checkout instance or `create` method is missing.'
                );
                return;
            }

            // Step 2: Create the express-component component (renders Apple Pay, Google Pay, etc.)
            expressComponent = checkout.create('express-component');

            if (
                !expressComponent ||
                typeof expressComponent.mount !== 'function' ||
                typeof expressComponent.unmount !== 'function'
            ) {
                console.error(
                    'Mollie express component is invalid or missing required methods.'
                );
                expressComponent = null;
                return;
            }

            // Step 3: Mount the component into the DOM element with id="express-component".
            const mountPoint = document.getElementById('express-component');
            if (!mountPoint) {
                console.error(
                    'Mount point #express-component not found in the DOM.'
                );
                expressComponent = null;
                return;
            }

            expressComponent.mount(mountPoint);
        } catch (error) {
            console.error('Error during Mollie component setup:', error);
            expressComponent = null;
        }

        // Cleanup: unmount the component when this React component is removed from the DOM.
        return () => {
            if (
                expressComponent &&
                typeof expressComponent.unmount === 'function'
            ) {
                try {
                    expressComponent.unmount();
                } catch (unmountError) {
                    console.error(
                        'Error during Mollie component unmount:',
                        unmountError
                    );
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
            {/* The Mollie Express Component is mounted into this div by the SDK */}
            <Flex id="express-component"></Flex>
        </Flex>
    );
}
