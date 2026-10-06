'use client';

import { useState } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

// A piece of client state that is mirrored into a URL query param, so a
// reload or a shared link preserves the choice (e.g. selected currency or
// country on the checkout form). Returns the current value and a setter
// that updates both the state and the URL.
export function useUrlSyncedState(
    key: string,
    defaultValue: string,
): [string, (value: string) => void] {
    const [value, setValue] = useState(defaultValue);
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    // If the URL already has a different value (e.g. on first load, or the
    // user navigated back), adopt it.
    const urlValue = searchParams.get(key);
    if (urlValue && urlValue !== value) {
        setValue(urlValue);
    }

    function setValueAndUrl(next: string) {
        setValue(next);
        const params = new URLSearchParams(searchParams);
        if (next) {
            params.set(key, next);
        } else {
            params.delete(key);
        }
        replace(`${pathname}?${params.toString()}`, { scroll: false });
    }

    return [value, setValueAndUrl];
}
