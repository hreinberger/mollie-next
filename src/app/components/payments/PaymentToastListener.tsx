'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@radix-ui/themes';
import type { RecentPayment } from '@/app/api/payments/recent/route';

const POLL_INTERVAL_MS = 10_000;

const ERROR_STATUSES = new Set(['canceled', 'expired', 'failed']);

// Completing the hosted checkout is a full cross-origin round trip
// (redirect to mollie.com, then back to /success), which reloads the tab
// and wipes any plain in-memory baseline. sessionStorage survives that
// reload while still being scoped to this tab, so the payment that just
// completed is correctly seen as "changed" instead of being silently
// re-seeded as the new baseline.
const STORAGE_KEY = 'mollie-demo:seen-payments';

function loadBaseline(): Map<string, string> | null {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return null;
        }
        return new Map(JSON.parse(raw));
    } catch {
        return null;
    }
}

function saveBaseline(seen: Map<string, string>) {
    try {
        sessionStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(Array.from(seen.entries())),
        );
    } catch {
        // Storage unavailable (e.g. private browsing) — dedup just won't
        // survive a reload, which doesn't break anything else.
    }
}

export default function PaymentToastListener() {
    const router = useRouter();
    const seenRef = useRef<Map<string, string> | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function poll() {
            let payments: RecentPayment[];
            try {
                const response = await fetch('/api/payments/recent');
                if (!response.ok) {
                    return;
                }
                payments = await response.json();
            } catch (error) {
                console.error('Failed to poll for recent payments:', error);
                return;
            }

            if (cancelled) {
                return;
            }

            if (seenRef.current === null) {
                seenRef.current = loadBaseline();
            }

            const seen = seenRef.current;

            if (seen === null) {
                // Truly first-ever poll in this tab: seed the baseline so we
                // don't toast for payments that already existed before this
                // tab was opened.
                const initial = new Map(payments.map((p) => [p.id, p.status]));
                seenRef.current = initial;
                saveBaseline(initial);
                return;
            }

            let changed = false;

            for (const payment of payments) {
                const previousStatus = seen.get(payment.id);
                if (previousStatus === payment.status) {
                    continue;
                }

                const url = `/payments/${payment.id}?mode=${payment.mode}`;
                const message = `New payment status — ${payment.status}`;
                const toastFn =
                    payment.status === 'paid'
                        ? toast.success
                        : ERROR_STATUSES.has(payment.status)
                          ? toast.error
                          : toast.message;

                toastFn(message, {
                    action: (
                        <Button
                            size="1"
                            variant="surface"
                            onClick={() => router.push(url)}
                        >
                            View payment
                        </Button>
                    ),
                });

                seen.set(payment.id, payment.status);
                changed = true;
            }

            if (changed) {
                saveBaseline(seen);
            }
        }

        poll();
        const interval = setInterval(poll, POLL_INTERVAL_MS);

        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, [router]);

    return null;
}
