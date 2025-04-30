'use client';

import { SegmentedControl } from '@radix-ui/themes';

import React, { Suspense } from 'react';

import MethodsSkeleton from './methodskeleton';
import ComponentPaymentMethods from './componentpaymentmethods';

import { CheckoutVariant } from '@/app/lib/types';

export default function MethodSwitch({
  hostedmethods,
  variant,
  onClick,
}: {
  hostedmethods: React.ReactNode;
  variant: CheckoutVariant;
  onClick: (value: string) => void;
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
        <Suspense fallback={MethodsSkeleton()}>{hostedmethods}</Suspense>
      ) : (
        <Suspense fallback={MethodsSkeleton()}>
          {/* <ComponentPaymentMethods /> */}
        </Suspense>
      )}
    </>
  );
}
