'use client';

import ErrorBoundaryCard from '@/app/components/ui/ErrorBoundaryCard';

export default function Error({
    error,
}: {
    error: Error & { digest?: string };
}) {
    return <ErrorBoundaryCard error={error} backHref="/" backLabel="Back to Checkout" />;
}
