'use client';

import { SegmentedControl, Callout } from '@radix-ui/themes';
import { ExclamationTriangleIcon, InfoCircledIcon } from '@radix-ui/react-icons';

import React, { Suspense } from 'react';

import MethodsSkeleton from './methodskeleton';
import ComponentPaymentMethods from './componentpaymentmethods';
import SessionWrapper from '@/app/components/form/methods/SessionWrapper';
import CardWrapperV2 from '@/app/components/form/methods/CardWrapperV2';

import { CheckoutVariant } from '@/app/lib/types';

export default function MethodSwitch({
    hostedmethods,
    variant,
    onVariantChange,
    session,
    showComponents,
}: {
    hostedmethods: React.ReactNode;
    variant: CheckoutVariant;
    onVariantChange: (value: string) => void;
    session: {
        id: string;
        clientAccessToken: string;
    };
    showComponents: boolean;
}) {
    return (
        <>
            <SegmentedControl.Root
                size="1"
                mx="1"
                value={variant}
                onValueChange={onVariantChange}
            >
                <SegmentedControl.Item value="hosted">
                    Hosted Checkout
                </SegmentedControl.Item>
                <SegmentedControl.Item value="components">
                    Components v1
                </SegmentedControl.Item>
                {showComponents && (
                    <SegmentedControl.Item value="components-v2">
                        Components v2
                    </SegmentedControl.Item>
                )}
            </SegmentedControl.Root>

            {variant === 'hosted' && (
                <Suspense fallback={MethodsSkeleton()}>
                    {hostedmethods}
                </Suspense>
            )}

            {variant === 'components' && (
                <Suspense fallback={MethodsSkeleton()}>
                    <ComponentPaymentMethods />
                </Suspense>
            )}

            {variant === 'components-v2' && (
                <Suspense fallback={MethodsSkeleton()}>
                    {showComponents ? (
                        <>
                            <Callout.Root
                                color="orange"
                                size="1"
                            >
                                <Callout.Icon>
                                    <ExclamationTriangleIcon />
                                </Callout.Icon>
                                <Callout.Text>
                                    These are <strong>live payments</strong> and
                                    will charge your card.
                                </Callout.Text>
                            </Callout.Root>
                            <SessionWrapper session={session} />
                            <CardWrapperV2 session={session} />
                        </>
                    ) : (
                        <Callout.Root
                            color="blue"
                            size="1"
                        >
                            <Callout.Icon>
                                <InfoCircledIcon />
                            </Callout.Icon>
                            <Callout.Text>
                                Sign in with a Mollie account to use Components
                                v2.
                            </Callout.Text>
                        </Callout.Root>
                    )}
                </Suspense>
            )}
        </>
    );
}
