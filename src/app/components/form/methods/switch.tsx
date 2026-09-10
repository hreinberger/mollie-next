'use client';

import { Box, SegmentedControl, Callout, Tabs } from '@radix-ui/themes';
import { ExclamationTriangleIcon, InfoCircledIcon } from '@radix-ui/react-icons';

import React, { Suspense } from 'react';

import MethodsSkeleton from './methodskeleton';
import ComponentPaymentMethods from './componentpaymentmethods';
import SessionWrapper from '@/app/components/form/methods/SessionWrapper';
import CardWrapperV2 from '@/app/components/form/methods/CardWrapperV2';
import MethodsWrapperV2 from '@/app/components/form/methods/MethodsWrapperV2';
import AddressSourceToggle from '@/app/components/form/AddressSourceToggle';

import { CheckoutVariant, AddressSource } from '@/app/lib/types';

export default function MethodSwitch({
    hostedmethods,
    variant,
    onVariantChange,
    session,
    showComponents,
    addressSource,
    onAddressSourceChange,
    addressSourcePending,
}: {
    hostedmethods: React.ReactNode;
    variant: CheckoutVariant;
    onVariantChange: (value: string) => void;
    session: {
        id: string;
        clientAccessToken: string;
    };
    showComponents: boolean;
    addressSource: AddressSource;
    onAddressSourceChange: (checked: boolean) => void;
    addressSourcePending: boolean;
}) {
    // Hosted checkout and Components v1 collect the billing address from
    // our own form — when that form is bypassed in favor of Express
    // Checkout session address collection, only Components v2 works.
    const addressCollectedBySession = addressSource === 'session';

    type MethodsTabValue = 'methods' | 'express' | 'card';
    const [activeMethodsTab, setActiveMethodsTab] =
        React.useState<MethodsTabValue>(
            addressCollectedBySession ? 'express' : 'methods'
        );

    // The "Payment methods" tab only exists when address collection isn't
    // delegated to the session — if it's selected when that toggles on, fall
    // back to the Express Checkout tab instead of leaving no tab active.
    React.useEffect(() => {
        if (addressCollectedBySession && activeMethodsTab === 'methods') {
            setActiveMethodsTab('express');
        }
    }, [addressCollectedBySession, activeMethodsTab]);

    return (
        <>
            <SegmentedControl.Root
                size="1"
                mx="1"
                value={variant}
                onValueChange={onVariantChange}
            >
                {!addressCollectedBySession && (
                    <SegmentedControl.Item value="hosted">
                        Hosted Checkout
                    </SegmentedControl.Item>
                )}
                {!addressCollectedBySession && (
                    <SegmentedControl.Item value="components">
                        Components v1
                    </SegmentedControl.Item>
                )}
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
                            <Box
                                style={{
                                    opacity: addressSourcePending ? 0.5 : 1,
                                    pointerEvents: addressSourcePending
                                        ? 'none'
                                        : undefined,
                                    transition: 'opacity 150ms ease',
                                }}
                                aria-busy={addressSourcePending}
                            >
                                <Tabs.Root
                                    value={activeMethodsTab}
                                    onValueChange={(value) =>
                                        setActiveMethodsTab(
                                            value as MethodsTabValue
                                        )
                                    }
                                >
                                    <Tabs.List>
                                        {!addressCollectedBySession && (
                                            <Tabs.Trigger value="methods">
                                                Payment methods
                                            </Tabs.Trigger>
                                        )}
                                        <Tabs.Trigger value="express">
                                            Express Checkout
                                        </Tabs.Trigger>
                                        <Tabs.Trigger value="card">
                                            Card
                                        </Tabs.Trigger>
                                    </Tabs.List>

                                    <Box pt="3">
                                        {!addressCollectedBySession && (
                                            <Tabs.Content value="methods">
                                                <MethodsWrapperV2
                                                    session={session}
                                                />
                                            </Tabs.Content>
                                        )}

                                        <Tabs.Content value="express">
                                            <AddressSourceToggle
                                                current={addressSource}
                                                onChange={
                                                    onAddressSourceChange
                                                }
                                                pending={addressSourcePending}
                                            />
                                            <SessionWrapper
                                                session={session}
                                            />
                                        </Tabs.Content>

                                        <Tabs.Content value="card">
                                            <CardWrapperV2
                                                session={session}
                                            />
                                        </Tabs.Content>
                                    </Box>
                                </Tabs.Root>
                            </Box>
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
