'use client';

import React, {
    createContext,
    useContext,
    useRef,
    useState,
    useEffect,
} from 'react';
import {
    MollieContextType,
    MollieInstance,
    MollieProviderProps,
} from './types';

// Create a context to store the Mollie object for components
export const MollieContext = createContext<MollieContextType>({ mollie: null });

// Provider component to wrap the app with
// This is needed so that the Mollie object is available to all components
export const MollieProvider = ({ children }: MollieProviderProps) => {
    const mollieRef = useRef<MollieInstance | null>(null);
    const [mollie, setMollie] = useState<MollieInstance | null>(null);

    useEffect(() => {
        // Load Mollie script and initialize
        const loadMollie = async () => {
            if (
                !mollieRef.current &&
                typeof window !== 'undefined' &&
                window.Mollie
            ) {
                mollieRef.current = window.Mollie(
                    process.env.NEXT_PUBLIC_MOLLIE_PROFILE as string,
                    {
                        locale: 'en_US',
                        testmode: true,
                    }
                );
                setMollie(mollieRef.current);
            }
        };
        loadMollie();
        // The Mollie v1 script is loaded globally via next/script in layout.tsx.
        // We call loadMollie() directly here to initialize the Mollie object
        // from window.Mollie once the component mounts.
        return () => {
            if (mollieRef.current) {
                mollieRef.current = null;
                setMollie(null);
            }
        };
    }, []);

    return (
        <MollieContext.Provider value={{ mollie }}>
            {children}
        </MollieContext.Provider>
    );
};

// Custom hook to use the Mollie object
export const useMollie = (): MollieContextType => {
    return useContext(MollieContext);
};
