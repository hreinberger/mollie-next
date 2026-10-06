'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@radix-ui/themes';

export default function SubmitButton({
    label,
    color,
}: {
    label: string;
    color: 'green' | 'orange' | 'red';
}) {
    const { pending } = useFormStatus();
    return (
        <Button
            size="2"
            variant="soft"
            color={color}
            type="submit"
            loading={pending}
            aria-label={label}
        >
            {label}
        </Button>
    );
}
