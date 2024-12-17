'use client';

declare global {
    interface Window {
        Mollie: any;
    }
}

import {
    Card,
    Flex,
    RadioGroup,
    Separator,
    Text,
    Callout,
    Skeleton,
    Code,
    Box,
} from '@radix-ui/themes';

import React, { Suspense, useEffect, useRef } from 'react';
import { IdCardIcon } from '@radix-ui/react-icons';
import PaymentLogo from '@/app/components/form/paymentlogo';

export default function ComponentPaymentMethods() {
    const mollieInitialized = useRef(false);
    const mollieObject = useRef<any>(null);
    const mollieComponents = useRef<any>(null);

    // Load Mollie script and initialize Mollie object
    useEffect(() => {
        let mollie = window.Mollie('pfl_FHTbr2nyYb', {
            locale: 'en_US',
            testmode: true,
        });
        console.debug('Mollie object created');
        console.debug(mollie);
        mollieInitialized.current = true;
        mollieObject.current = mollie;

        if (mollieInitialized.current) {
            const card = document.getElementById('card');
            if (card) {
                console.debug('Creating Mollie card component');
                console.debug(mollieObject.current);
                const mollie = mollieObject.current;
                const cardComponent = mollie.createComponent('card');
                cardComponent.mount(card);
                mollieComponents.current = cardComponent;
            }
        }

        return () => {
            console.debug('Unmounting Mollie card component');
            const cardComponent = mollieComponents.current;
            cardComponent.unmount();
            mollie = null;
            mollieInitialized.current = false;
            mollieObject.current = null;
            mollieComponents.current = null;
        };
    }, [mollieInitialized, mollieObject, mollieComponents]);

    return (
        <>
            <RadioGroup.Root
                defaultValue="creditcard"
                name="payment_method"
            >
                <Card m="1">
                    <Flex direction="column">
                        <Flex
                            align="center"
                            justify="between"
                            gap="4"
                        >
                            <Text as="label">
                                <Flex
                                    gap="2"
                                    align="center"
                                >
                                    <RadioGroup.Item value="creditcard" />
                                    Card
                                </Flex>
                            </Text>
                            <Suspense
                                fallback={
                                    <Skeleton
                                        width="32px"
                                        height="24px"
                                    />
                                }
                            >
                                <PaymentLogo method="creditcard" />
                            </Suspense>
                        </Flex>
                        <Separator
                            my="3"
                            size="4"
                        />
                        <Flex
                            direction="column"
                            gap="1"
                        >
                            <Box
                                mb="2"
                                mx="1"
                                id="card"
                            ></Box>
                        </Flex>
                        <Callout.Root size="1">
                            <Callout.Icon>
                                <IdCardIcon />
                            </Callout.Icon>
                            <Callout.Text>
                                <Code variant="soft">2223 0000 1047 9399</Code>
                            </Callout.Text>
                        </Callout.Root>
                    </Flex>
                </Card>
            </RadioGroup.Root>
        </>
    );
}
