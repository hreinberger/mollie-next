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
        // Load the Mollie script
        // Only load Mollie if it's not already available
        // if (typeof window !== 'undefined') {
        //     if (!window.Mollie) {
        //         const script = document.createElement('script');
        //         script.src = 'https://js.mollie.com/v1/mollie.js';
        //         script.async = true;
        //         script.onload = loadMollie;
        //         document.body.appendChild(script);

        //         // Return cleanup function to remove script when component unmounts
        //         return () => {
        //             if (script.parentNode) {
        //                 document.body.removeChild(script);
        //             }
        //         };
        //     } else {
        //         // If Mollie is already available, just initialize it
        //         loadMollie();
        //     }
        // }

        // Cleanup function to unload Mollie object
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
