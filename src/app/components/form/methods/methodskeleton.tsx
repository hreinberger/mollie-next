import {
    Card,
    Text,
    RadioCards,
    Skeleton,
} from '@radix-ui/themes';
import React from 'react';

// mock some methods
const methods = [
    {
        id: 'ideal',
        description: 'iDeal',
    },
    {
        id: 'creditcard',
        description: 'Credit Card',
    },
    {
        id: 'paypal',
        description: 'PayPal',
    },
    {
        id: 'Billie',
        description: 'Billie',
    },
    {
        id: 'bancontact',
        description: 'Bancontact',
    },
    {
        id: 'giropay',
        description: 'Giropay',
    },
    {
        id: 'eps',
        description: 'EPS',
    },
    {
        id: 'kbc',
        description: 'KBC/CBC',
    },
];

export default async function MethodsSkeleton() {
    return (
        <>
            <Card m="1">
                <RadioCards.Root
                    defaultValue={methods[0]?.id}
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
                                <Skeleton
                                    width="32px"
                                    height="24px"
                                ></Skeleton>
                                <Skeleton>
                                    <Text>{method.description}</Text>
                                </Skeleton>
                            </RadioCards.Item>
                        </React.Fragment>
                    ))}
                </RadioCards.Root>
            </Card>
        </>
    );
}
