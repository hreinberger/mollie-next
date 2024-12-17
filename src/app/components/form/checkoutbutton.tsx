'use client';

import { Button } from '@radix-ui/themes';
import { useFormStatus } from 'react-dom';
import { checkoutVariant } from '@/app/lib/validation';

export default function CheckoutButton({
    variant,
}: {
    variant: checkoutVariant;
}) {
    // display a loading indicator once the button is clicked
    const { pending } = useFormStatus();

    return (
        <Button
            variant="solid"
            size="3"
            className="w-8/12 sm:w-6/12 lg:w-4/12"
            loading={pending}
        >
            Buy Now
        </Button>
    );
}
