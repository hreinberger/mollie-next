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

    // Load the Mollie script
    if (typeof window !== 'undefined' && !window.Mollie) {
      const script = document.createElement('script');
      script.src = 'https://js.mollie.com/v1/mollie.js';
      script.async = true;
      script.onload = loadMollie;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    } else {
      loadMollie();
    }

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

// Declare the Mollie global type
declare global {
  interface Window {
    Mollie: (
      profileId: string,
      options: { locale: string; testmode: boolean }
    ) => MollieInstance;
  }
}
