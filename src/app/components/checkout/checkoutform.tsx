'use client';

// UI
import { Box, Flex, Grid, Heading } from '@radix-ui/themes';

// React Types
import React from 'react';

// Next.js navigation
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

// Lib
import { CheckoutVariant, AddressSource } from '@/app/lib/types';

// Client Components
import CheckoutButton from './checkoutbutton';
import MethodSwitch from './methods/switch';
import ShoppingCart from './shoppingcart';

// This is the main checkout form component

// It takes the address and payment methods as props
// The form itself is a client component (to make use of client-side JavaScript), but the address and payment methods are server components
// The form is submitted to the createPayment function when the CheckoutButton is clicked

export default function CheckoutForm({
    address,
    hostedmethods,
    session,
    showComponents,
    addressSource,
}: {
    address: React.ReactNode;
    hostedmethods: React.ReactNode;
    session: {
        id: string;
        clientAccessToken: string;
    };
    showComponents: boolean;
    addressSource: AddressSource;
}) {
    // Use React State to switch between hosted and component payment methods
    const [checkoutVariant, setCheckoutVariant] = React.useState<CheckoutVariant>(
        addressSource === 'session' ? 'components-v2' : 'hosted'
    );

    // When address collection is delegated to the Express Checkout session,
    // only Components v2 (Express) can supply it — hosted checkout and
    // Components v1 build the billing address from the form fields, which
    // are hidden in this mode. Keep the variant in sync if the toggle
    // changes after mount (mirrors the URL-sync pattern in shoppingcart.tsx).
    if (addressSource === 'session' && checkoutVariant !== 'components-v2') {
        setCheckoutVariant('components-v2');
    }

    // Toggling the address source re-renders the Server Component tree
    // (it recreates the Mollie Session with/without requiredCustomerDetails),
    // which takes a network round-trip. useTransition exposes that as a
    // pending state so we can show a spinner and dim the affected areas
    // instead of the UI just appearing to hang.
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isAddressSourcePending, startAddressSourceTransition] =
        React.useTransition();

    function handleAddressSourceChange(checked: boolean) {
        const params = new URLSearchParams(searchParams);
        if (checked) {
            params.set('addressSource', 'session');
        } else {
            params.delete('addressSource');
        }
        startAddressSourceTransition(() => {
            router.replace(`${pathname}?${params.toString()}`, {
                scroll: false,
            });
        });
    }

    return (
        // The form data is sent to the createPayment function when the form is submitted
        <form>
            <Flex
                direction="column"
                m="6"
            >
                <Heading mb="4">Checkout</Heading>

                <Grid
                    pt="2"
                    columns={{
                        initial: '1',
                        md: '2',
                    }}
                    gap="5"
                    gapY="6"
                >
                    <Box
                        style={{
                            opacity: isAddressSourcePending ? 0.5 : 1,
                            pointerEvents: isAddressSourcePending
                                ? 'none'
                                : undefined,
                            transition: 'opacity 150ms ease',
                        }}
                        aria-busy={isAddressSourcePending}
                    >
                        {address}
                    </Box>
                    <Flex
                        direction="column"
                        gap="2"
                    >
                        <ShoppingCart />
                        <Heading
                            size="3"
                            mt="2"
                        >
                            Payment
                        </Heading>
                        <MethodSwitch
                            variant={checkoutVariant}
                            hostedmethods={hostedmethods}
                            onVariantChange={(value) =>
                                setCheckoutVariant(
                                    value as CheckoutVariant
                                )
                            }
                            session={session}
                            showComponents={showComponents}
                            addressSource={addressSource}
                            onAddressSourceChange={handleAddressSourceChange}
                            addressSourcePending={isAddressSourcePending}
                        />
                    </Flex>
                </Grid>
                {checkoutVariant !== 'components-v2' && (
                    <Flex
                        align="center"
                        justify="center"
                        mt="6"
                    >
                        <CheckoutButton variant={checkoutVariant} />
                    </Flex>
                )}
            </Flex>
        </form>
    );
}
