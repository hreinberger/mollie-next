'use client';

import { Text } from '@radix-ui/themes';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Reads the active pathname to bold the current nav link. Kept as its own
// leaf component (rather than read in Navbar itself) so only this label
// suspends under Cache Components — the rest of the nav stays prerendered.
export default function NavLinkLabel({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <Text
            size={{
                initial: '1',
                xs: '2',
                md: '3',
                xl: '4',
            }}
            className={clsx(
                'transition-all duration-100',
                pathname === href ? 'font-bold' : 'font-medium',
            )}
        >
            {children}
        </Text>
    );
}
