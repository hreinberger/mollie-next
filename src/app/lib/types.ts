import { ReactNode } from 'react';
import { CaptureMethod, PaymentMethod } from '@mollie/api-client';
import { z } from 'zod';

// Extended payment methods to include beta/testing methods
export const ExtendedPaymentMethod = z.enum([
    ...Object.values(PaymentMethod),
    // Add beta payment methods here for testing
    'bizum',
    'vippsmobilepay',
] as const);

// Export the type for use in other files
export type ExtendedPaymentMethodType = z.infer<typeof ExtendedPaymentMethod>;

// Mollie Context types
export type MollieInstance = {
    createComponent: (type: string) => {
        mount: (selector: string) => void;
        unmount: () => void;
    };
    createToken: () => Promise<{ token: string; error?: string }>;
};

export type MollieContextType = {
    mollie: MollieInstance | null;
};

export type MollieProviderProps = {
    children: ReactNode;
};

// Declare the Mollie and Mollie2 global types
declare global {
    interface Window {
        // the "old" Mollie object for card components
        Mollie: (
            profileId: string,
            options: { locale: string; testmode: boolean }
        ) => MollieInstance;
        // the new Mollie object for express components
        Mollie2: (
            clientAccessToken: string,
            options: { locale: string }
        ) => MollieExpressInstance;
    }
}

// Define the structure for the object returned by Mollie2()
export interface MollieExpressInstance {
    create: (componentType: string) => MollieExpressComponent;
}

// Define the structure for the object returned by mollie.create()
export interface MollieExpressComponent {
    mount: (element: HTMLElement | string | null) => void;
    unmount: () => void;
    on: (event: string, callback: (data?: unknown) => void) => void;
}

// Mollie payment form types
export type CreatePaymentParams = {
    firstname: string;
    lastname: string;
    company?: string;
    email: string;
    address: string;
    city: string;
    zip_code: string;
    country: string;
    payment_method: ExtendedPaymentMethodType;
    cardToken?: string;
    captureMode?: CaptureMethod;
    currency: string;
};

// Checkout types
export type CheckoutVariant = 'hosted' | 'components';

// Express Session Type
export type ExpressSession = {
    id: string;
    clientAccessToken: string;
};
