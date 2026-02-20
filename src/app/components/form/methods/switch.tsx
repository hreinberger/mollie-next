'use client';

import { SegmentedControl, Callout } from '@radix-ui/themes';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

import React, { Suspense } from 'react';

import MethodsSkeleton from './methodskeleton';
import ComponentPaymentMethods from './componentpaymentmethods';
import SessionWrapper from '@/app/components/form/methods/SessionWrapper';

import { CheckoutVariant } from '@/app/lib/types';

export default function MethodSwitch({
    hostedmethods,
    variant,
    onClick,
    session,
}: {
    hostedmethods: React.ReactNode;
    variant: CheckoutVariant;
    onClick: (value: string) => void;
    session: {
        id: string;
        clientAccessToken: string;
    };
}) {
    // Use React State to switch between hosted and component payment methods
    // If the State is switched to 'hosted', the HostedPaymentMethods server component is rendered
    // If the State is switched to 'components', the ComponentPaymentMethods component is rendered
    // Because HostedPaymentMethods is a server component, it is retrieved as a prop
    return (
        <>
            <SegmentedControl.Root
                size="1"
                mx="1"
                value={variant}
                onValueChange={onClick}
            >
                <SegmentedControl.Item value="hosted">
                    Hosted Checkout
                </SegmentedControl.Item>
                <SegmentedControl.Item value="components">
                    Components
                </SegmentedControl.Item>
            </SegmentedControl.Root>
            {variant === 'hosted' ? (
                <Suspense fallback={MethodsSkeleton()}>
                    {hostedmethods}
                </Suspense>
            ) : (
                <Suspense fallback={MethodsSkeleton()}>
                    <Callout.Root color="orange" size="1">
                        <Callout.Icon>
                            <ExclamationTriangleIcon />
                        </Callout.Icon>
                        <Callout.Text>
                            Express payments are <strong>live payments</strong> and will charge your card.
                        </Callout.Text>
                    </Callout.Root>
                    <SessionWrapper session={session} />
                    <ComponentPaymentMethods />
                </Suspense>
            )}
        </>
    );
}
