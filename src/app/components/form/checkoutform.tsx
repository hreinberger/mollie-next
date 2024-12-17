'use client';

// UI
import { Flex, Grid, Heading } from '@radix-ui/themes';

// Next and React logic
import React, { useState } from 'react';

// Lib
import { createPayment } from '@/app/lib/server-actions';
import { checkoutVariant } from '@/app/lib/validation';

// Form components
import CheckoutButton from './checkoutbutton';
import MethodSwitch from './methods/switch';

export default function CheckoutForm({
    address,
    cart,
    hostedmethods,
}: {
    address: React.ReactNode;
    cart: React.ReactNode;
    hostedmethods: React.ReactNode;
}) {
    // Use React State to switch between hosted and component payment methods
    const [checkoutVariant, setCheckoutVariant] =
        React.useState<checkoutVariant>('hosted');
    return (
        // The form data is sent to the createPayment function when the form is submitted
        <form action={createPayment}>
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
                    {address}
                    <Flex
                        direction="column"
                        gap="2"
                    >
                        {cart}
                        <Heading
                            size="3"
                            mt="2"
                        >
                            Payment
                        </Heading>
                        <MethodSwitch
                            variant={checkoutVariant}
                            prop={hostedmethods}
                            onClick={() =>
                                setCheckoutVariant((prev) =>
                                    prev === 'hosted' ? 'components' : 'hosted'
                                )
                            }
                        />
                    </Flex>
                </Grid>
                <Flex
                    align="center"
                    justify="center"
                    mt="6"
                >
                    <CheckoutButton variant={checkoutVariant} />
                </Flex>
            </Flex>
        </form>
    );
}
