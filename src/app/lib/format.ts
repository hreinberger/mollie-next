// Shared display-formatting helpers used across the payments/balances UI.

export function formatDateTime(
    date: string | Date,
    dateStyle: 'medium' | 'short' = 'medium',
): string {
    return new Date(date).toLocaleString('de-DE', {
        dateStyle,
        timeStyle: 'short',
    });
}

export function formatAmount(amount?: {
    value: string;
    currency: string;
}): string {
    return amount ? `${amount.currency} ${amount.value}` : '—';
}

// A balance transaction's `context` object holds the related resource, e.g.
// { paymentId: 'tr_…' }. This pulls out that id regardless of its key name.
export function contextId(context?: Record<string, unknown>): string | undefined {
    if (!context) return undefined;
    const value = Object.values(context).find(
        (v) => typeof v === 'string' && /^[a-z]+_/.test(v),
    );
    return value as string | undefined;
}
