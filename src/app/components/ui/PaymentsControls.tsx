'use client';

import { Switch, Flex, Text, Button, Tooltip } from '@radix-ui/themes';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { useRouter, useSearchParams } from 'next/navigation';

interface PaymentsControlsProps {
    isMollie: boolean;
    mode: 'test' | 'live';
    nextCursor: string | null;
    prevCursor: string | null;
}

export default function PaymentsControls({
    isMollie,
    mode,
    nextCursor,
    prevCursor,
}: PaymentsControlsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    function buildParams(updates: Record<string, string | null>) {
        const params = new URLSearchParams(searchParams.toString());
        for (const [key, value] of Object.entries(updates)) {
            if (value === null) {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        }
        const qs = params.toString();
        return qs ? `?${qs}` : '';
    }

    function handleModeChange(live: boolean) {
        router.push(`/payments${buildParams({ mode: live ? 'live' : null, from: null })}`);
    }

    function handlePrev() {
        if (prevCursor) router.push(`/payments${buildParams({ from: prevCursor })}`);
    }

    function handleNext() {
        if (nextCursor) router.push(`/payments${buildParams({ from: nextCursor })}`);
    }

    const liveToggle = (
        <Flex align="center" gap="2">
            <Text size="2">Live payments</Text>
            <Switch
                checked={mode === 'live'}
                onCheckedChange={handleModeChange}
                disabled={!isMollie}
            />
        </Flex>
    );

    return (
        <Flex justify="between" align="center">
            {!isMollie ? (
                <Tooltip content="Sign in with your @mollie.com email to view live payments.">
                    {liveToggle}
                </Tooltip>
            ) : liveToggle}
            <Flex gap="2">
                <Button variant="outline" disabled={!prevCursor} onClick={handlePrev}>
                    <ChevronLeftIcon />
                    Previous
                </Button>
                <Button variant="outline" disabled={!nextCursor} onClick={handleNext}>
                    Next
                    <ChevronRightIcon />
                </Button>
            </Flex>
        </Flex>
    );
}
