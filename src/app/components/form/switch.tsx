'use client';

import { SegmentedControl } from '@radix-ui/themes';

import React, { Children, Suspense } from 'react';

export default function MethodSwitch({ prop }: { prop: React.ReactNode }) {
    const [value, setValue] = React.useState('hpp');
    return (
        <>
            <SegmentedControl.Root
                value={value}
                onValueChange={(value) => {
                    if (value) setValue(value);
                }}
            >
                <SegmentedControl.Item value="hpp">
                    Hosted Checkout
                </SegmentedControl.Item>
                <SegmentedControl.Item value="components">
                    Components
                </SegmentedControl.Item>
            </SegmentedControl.Root>
            {value === 'hpp' ? (
                <Suspense fallback={<p>Loading Methods...</p>}>{prop}</Suspense>
            ) : (
                <div>Components</div>
            )}
        </>
    );
}
