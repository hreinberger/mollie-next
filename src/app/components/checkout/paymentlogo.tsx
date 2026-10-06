'use client';

import { Flex } from '@radix-ui/themes';
import Image from 'next/image';

export default function PaymentLogo({ method }: { method: string }) {
    return (
        <Flex>
            <Image
                src={`https://mollie.com/external/icons/payment-methods/${method}.svg`}
                alt={method}
                title={method}
                height={24}
                width={32}
            />
        </Flex>
    );
}
