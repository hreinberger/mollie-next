import { ReactNode } from 'react';
import { CaptureMethod, PaymentMethod } from '@mollie/api-client';
import { z } from 'zod';

// Extended payment methods to include beta/testing methods
export const ExtendedPaymentMethod = z.enum([
    ...Object.values(PaymentMethod),
    // Add beta payment methods here for testing
    'bizum',
    'vippsmobilepay',
    'billink',
    'wero',
] as const);

// Export the type for use in other files
export type ExtendedPaymentMethodType = z.infer<typeof ExtendedPaymentMethod>;

export const ALWAYS_AUTHORIZE_METHODS = ['billink', 'riverty'] as const;

export const OPTIONALLY_AUTHORIZE_METHODS = [
    'creditcard',
    'klarna',
    'billie',
    'vipps',
    'vippsmobilepay',
    'mobilepay',
    'paypal',
] as const;

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
export type CheckoutVariant = 'hosted' | 'components' | 'components-v2';

// Controls whether billing/email details are collected by our own checkout
// form, or delegated to the Mollie Express Checkout session (Apple Pay /
// Google Pay). See requiredCustomerDetails on mollieCreateSession.
export type AddressSource = 'form' | 'session';

// Express Session Type
export type ExpressSession = {
    id: string;
    clientAccessToken: string;
};

// A selectable delivery option offered by the Express Checkout session when
// address collection is delegated to Mollie. See shippingOptions on
// mollieCreateSession.
export type ShippingOption = {
    reference: string;
    description: string;
    amount: {
        currency: string;
        value: string;
    };
};

// Fixed demo shipping options offered once address collection is delegated to
// the session. See
// https://mollie.atlassian.net/wiki/spaces/PPE/pages/6804078599/Fixed+shipping+options
export function getFixedShippingOptions(currency: string): ShippingOption[] {
    return [
        {
            reference: 'free',
            description: 'Free shipping',
            amount: { currency, value: '0.00' },
        },
        {
            reference: 'express',
            description: 'Express shipping',
            amount: { currency, value: '0.01' },
        },
    ];
}
