import Image from 'next/image';
import { useEffect, useState } from 'react';

type MollieLogoProps = {
    mode: 'light' | 'dark';
};

export default function MollieLogo({ mode }: MollieLogoProps) {
    // Change version of the logo based on a media query.
    // If the user prefers dark mode, the light version of the logo is shown.

    const [systemMode, setSystemMode] = useState<'light' | 'dark'>(mode);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            setSystemMode(e.matches ? 'dark' : 'light');
        };

        mediaQuery.addEventListener('change', handleChange);
        setSystemMode(mediaQuery.matches ? 'dark' : 'light');

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    const src =
        systemMode === 'light' ? '/mollie-dark.svg' : '/mollie-light.svg';
    return (
        <Image
            src={src}
            alt="Mollie Logo"
            width={64}
            height={18.8}
        />
    );
}
