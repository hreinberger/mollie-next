'use client';

import { Switch, Flex, Text, Spinner } from '@radix-ui/themes';
import { AddressSource } from '@/app/lib/types';

// Lets the user switch between our own checkout form collecting the billing
// address/email, and delegating that collection to the Mollie Express
// Checkout session (Apple Pay / Google Pay). Rendered next to the Express
// Checkout buttons, since it only affects them.
//
// Purely presentational — the parent (CheckoutForm) owns the router
// navigation and the pending state, since toggling this also needs to dim
// the Address form and the Express buttons elsewhere in the tree. Radix
// Themes' Switch has no built-in `loading` prop (unlike Button), so the
// pending state is shown by wrapping it in Spinner instead — the same
// mechanism Button uses internally.
export default function AddressSourceToggle({
    current,
    onChange,
    pending,
}: {
    current: AddressSource;
    onChange: (checked: boolean) => void;
    pending: boolean;
}) {
    return (
        <Flex
            direction="column"
            gap="1"
            mb="2"
        >
            <Flex
                align="center"
                gap="2"
            >
                <Spinner loading={pending}>
                    <Switch
                        radius="full"
                        checked={current === 'session'}
                        onCheckedChange={onChange}
                        disabled={pending}
                        aria-label="Collect address via Express Checkout session"
                    />
                </Spinner>
                <Text size="2">
                    Collect address via Express Checkout session
                </Text>
            </Flex>
            <Text
                size="1"
                color="gray"
            >
                {pending
                    ? 'Updating checkout…'
                    : 'Apple Pay / Google Pay will collect email & billing address — the checkout address form is hidden.'}
            </Text>
        </Flex>
    );
}
