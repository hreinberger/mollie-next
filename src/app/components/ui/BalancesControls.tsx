'use client';

import { Flex, Button } from '@radix-ui/themes';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';

export default function BalancesControls({
    nextCursor,
    prevCursor,
}: {
    nextCursor: string | null;
    prevCursor: string | null;
}) {
    const router = useRouter();

    return (
        <Flex justify="end" gap="2">
            <Button
                variant="outline"
                disabled={!prevCursor}
                onClick={() => prevCursor && router.push(`/balances?from=${prevCursor}`)}
            >
                <ChevronLeftIcon />
                Previous
            </Button>
            <Button
                variant="outline"
                disabled={!nextCursor}
                onClick={() => nextCursor && router.push(`/balances?from=${nextCursor}`)}
            >
                Next
                <ChevronRightIcon />
            </Button>
        </Flex>
    );
}
