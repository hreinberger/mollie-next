'use client';

import ErrorBoundaryCard from '@/app/components/shared/ErrorBoundaryCard';

export default function Error({
    error,
}: {
    error: Error & { digest?: string };
}) {
    return <ErrorBoundaryCard error={error} backHref="/" backLabel="Back to Checkout" />;
}
