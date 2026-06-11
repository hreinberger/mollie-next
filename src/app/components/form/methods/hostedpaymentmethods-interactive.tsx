'use client';

import {
    Card,
    Flex,
    Separator,
    Text,
    Switch,
    RadioCards,
} from '@radix-ui/themes';
import React, { useState } from 'react';
import PaymentLogo from '@/app/components/form/paymentlogo';
import {
    ALWAYS_AUTHORIZE_METHODS,
    OPTIONALLY_AUTHORIZE_METHODS,
} from '@/app/lib/types';

type MethodShape = { id: string; description: string };

export default function HostedPaymentMethodsInteractive({
    methods,
}: {
    methods: MethodShape[];
}) {
    const [selectedMethod, setSelectedMethod] = useState<string>(
        methods[0]?.id ?? ''
    );

    const isAlwaysAuthorize = ALWAYS_AUTHORIZE_METHODS.includes(
        selectedMethod as any
    );
    const isOptionalAuthorize = OPTIONALLY_AUTHORIZE_METHODS.includes(
        selectedMethod as any
    );

    return (
        <Card m="1">
            <RadioCards.Root
                value={selectedMethod}
                onValueChange={setSelectedMethod}
                name="payment_method"
                columns={{ initial: '1', sm: '2' }}
                size={{ initial: '1', sm: '2' }}
                mb="3"
            >
                {methods.map((method) => (
                    <React.Fragment key={method.id}>
                        <RadioCards.Item
                            value={method.id}
                            aria-label={method.description}
                        >
                            <PaymentLogo method={method.id} />
                            <Text>{method.description}</Text>
                        </RadioCards.Item>
                    </React.Fragment>
                ))}
            </RadioCards.Root>

            {isAlwaysAuthorize && (
                <input
                    type="hidden"
                    name="captureMode"
                    value="manual"
                />
            )}

            {isOptionalAuthorize && (
                <>
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
                                        value="manual"
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
                </>
            )}
        </Card>
    );
}
