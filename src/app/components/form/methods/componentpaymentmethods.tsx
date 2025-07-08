'use client';

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
    Switch,
} from '@radix-ui/themes';

import React, { Suspense, useEffect } from 'react';
import { useMollie } from '@/app/lib/MollieContext';
import { IdCardIcon } from '@radix-ui/react-icons';
import PaymentLogo from '@/app/components/form/paymentlogo';

export default function ComponentPaymentMethods() {
    const { mollie } = useMollie();
    useEffect(() => {
        let cardComponent: any;
        if (mollie) {
            cardComponent = mollie.createComponent('card');
            cardComponent.mount('#card');
        }

        return () => {
            if (cardComponent) {
                cardComponent.unmount();
            }
        };
    }, [mollie]);

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
                                    <RadioGroup.Item
                                        value="creditcard"
                                        aria-label="credit card"
                                    />
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
                                <Code variant="ghost">2223 0000 1047 9399</Code>
                            </Callout.Text>
                        </Callout.Root>
                        <Separator
                            my="3"
                            size="4"
                        />
                        <Flex>
                            <Text
                                as="label"
                                size="2"
                            >
                                <Flex
                                    gap="2"
                                    direction="column"
                                >
                                    <Flex gap="2">
                                        <Switch
                                            radius="full"
                                            name="captureMode"
                                            value={'manual'}
                                            aria-label="Capture mode"
                                        />
                                        Authorize payment
                                    </Flex>
                                    <Text
                                        size="1"
                                        color="gray"
                                    >
                                        Authorized payments need to be captured
                                        later
                                    </Text>
                                </Flex>
                            </Text>
                        </Flex>
                    </Flex>
                </Card>
            </RadioGroup.Root>
        </>
    );
}
