'use client';

import { Flex } from '@radix-ui/themes';
import { useEffect } from 'react';
import { ExpressSession, MollieExpressComponent } from '@/app/lib/types';

type ComponentType = 'methods-component' | 'express-component' | 'card-component';

/**
 * Mounts one Mollie2 Express Components v2 widget into the DOM.
 *
 * Express Components flow:
 *  1. The server creates a Mollie Session (via mollieCreateSession) and passes
 *     the clientAccessToken down as part of the `session` prop.
 *  2. We initialize a Mollie2 Checkout instance using that token.
 *  3. We create the requested component (`type`) and mount it into the DOM
 *     element with id `elementId`.
 *  4. For the express-component: once the buyer confirms a payment method,
 *     the Session creates the Payment automatically — there is no client- or
 *     server-side "create payment" call to make, the buyer is redirected to
 *     the session's redirectUrl. For card-component/methods-component, the
 *     surrounding checkout flow still submits the form as usual.
 */
export default function MollieV2Component({
    session,
    type,
    elementId,
}: {
    session: ExpressSession | null;
    type: ComponentType;
    elementId: string;
}) {
    useEffect(() => {
        // Defined outside try so it's accessible in the cleanup function.
        let component: MollieExpressComponent | null = null;

        // Mollie2 is loaded via next/script (beforeInteractive) in layout.tsx.
        if (typeof window === 'undefined' || !window.Mollie2) {
            console.error('Mollie2 object is not available on window.');
            return;
        }

        if (!session?.clientAccessToken) {
            console.error('Mollie session or clientAccessToken is missing.');
            return;
        }

        try {
            const checkout = window.Mollie2.Checkout(session.clientAccessToken, {
                locale: 'en-US',
            });

            if (!checkout || typeof checkout.create !== 'function') {
                console.error(
                    'Failed to initialize Mollie Checkout instance or `create` method is missing.',
                );
                return;
            }

            component = checkout.create(type);

            if (
                !component ||
                typeof component.mount !== 'function' ||
                typeof component.unmount !== 'function'
            ) {
                console.error(
                    `Mollie ${type} component is invalid or missing required methods.`,
                );
                component = null;
                return;
            }

            const mountPoint = document.getElementById(elementId);
            if (!mountPoint) {
                console.error(`Mount point #${elementId} not found in the DOM.`);
                component = null;
                return;
            }

            component.mount(mountPoint);
        } catch (error) {
            console.error(`Error during Mollie ${type} setup:`, error);
            component = null;
        }

        return () => {
            if (component && typeof component.unmount === 'function') {
                try {
                    component.unmount();
                } catch (unmountError) {
                    console.error(
                        `Error during Mollie ${type} unmount:`,
                        unmountError,
                    );
                }
            }
        };
    }, [session, type, elementId]);

    return (
        <Flex align="center" justify="center" mt="4">
            {/* The Mollie component is mounted into this element by the SDK */}
            <div id={elementId} style={{ width: '100%' }} />
        </Flex>
    );
}
