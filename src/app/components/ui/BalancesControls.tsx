'use client';

import { Flex, Button } from '@radix-ui/themes';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';

// Sentinel pushed onto the history stack to represent "the first page" —
// which has no `from` cursor of its own.
const FIRST_PAGE = '~';

export default function BalancesControls({
    currentFrom,
    history,
    nextCursor,
}: {
    // The cursor the current page was loaded with, or null on the first page.
    currentFrom: string | null;
    // Stack of cursors (or FIRST_PAGE) for every page visited before this
    // one, oldest first. We maintain this ourselves because Mollie's
    // list-balance-transactions endpoint never returns a usable
    // `_links.previous` — verified against the live API, it's always null,
    // even several pages deep — so there's no backward cursor to read.
    history: string[];
    nextCursor: string | null;
}) {
    const router = useRouter();

    function buildUrl(from: string | null, remainingHistory: string[]) {
        const params = new URLSearchParams();
        if (from) params.set('from', from);
        if (remainingHistory.length > 0) {
            params.set('history', remainingHistory.join(','));
        }
        const qs = params.toString();
        return qs ? `/balances?${qs}` : '/balances';
    }

    function handlePrevious() {
        if (history.length === 0) return;
        const prev = history[history.length - 1];
        const remaining = history.slice(0, -1);
        router.push(buildUrl(prev === FIRST_PAGE ? null : prev, remaining));
    }

    function handleNext() {
        if (!nextCursor) return;
        const newHistory = [...history, currentFrom ?? FIRST_PAGE];
        router.push(buildUrl(nextCursor, newHistory));
    }

    return (
        <Flex justify="end" gap="2">
            <Button
                variant="outline"
                disabled={history.length === 0}
                onClick={handlePrevious}
            >
                <ChevronLeftIcon />
                Previous
            </Button>
            <Button
                variant="outline"
                disabled={!nextCursor}
                onClick={handleNext}
            >
                Next
                <ChevronRightIcon />
            </Button>
        </Flex>
    );
}
