import { ReactNode } from 'react';
import {
    CaptureMode,
    MethodEnum,
    type EntityBalance,
    type EntityBalanceTransaction,
    type SessionRequestOption1,
    type SessionResponse,
} from 'mollie-api-typescript/models';
import { z } from 'zod';

// Payment methods accepted by the API. The SDK is generated from the API
// spec, so beta methods appear here as soon as Mollie publishes them.
export const PaymentMethodSchema = z.enum(MethodEnum);
export type PaymentMethodType = z.infer<typeof PaymentMethodSchema>;

export const CaptureModeSchema = z.enum(CaptureMode);

export const ALWAYS_AUTHORIZE_METHODS: readonly PaymentMethodType[] = ['billink', 'riverty'];

export const OPTIONALLY_AUTHORIZE_METHODS: readonly PaymentMethodType[] = [
    'creditcard',
    'klarna',
    'billie',
    'vipps',
    'mobilepay',
    'paypal',
];

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
            options: { locale: string; testmode: boolean },
        ) => MollieInstance;
        // the new Mollie object for express components. Confusingly, unlike
        // Mollie() above, Mollie2 is not itself callable — it exposes a
        // .Checkout() factory function instead.
        Mollie2: {
            Checkout: (
                clientAccessToken: string,
                options: { locale: string },
            ) => MollieExpressInstance;
        };
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
    payment_method: PaymentMethodType;
    cardToken?: string;
    captureMode?: CaptureMode;
    currency: string;
};

// Checkout types
export type CheckoutVariant = 'hosted' | 'components' | 'components-v2';

// Controls whether billing/email details are collected by our own checkout
// form, or delegated to the Mollie Express Checkout session (Apple Pay /
// Google Pay). See requiredCustomerDetails on mollieCreateSession.
export type AddressSource = 'form' | 'session';

// Express Session Type — the full Checkout Session response from
// mollieCreateSession, which MollieV2Component uses for clientAccessToken
// and SessionDetailsDialog uses to surface the rest (status, amount,
// addresses, etc.) for debugging.
export type ExpressSession = SessionResponse;

// A selectable delivery option offered by the Express Checkout session when
// address collection is delegated to Mollie. See shippingOptions on
// mollieCreateSession.
export type ShippingOption = SessionRequestOption1;

// Fixed demo shipping options offered once address collection is delegated to
// the session.
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

// Balances API types
export type Balance = EntityBalance;
export type BalanceTransaction = EntityBalanceTransaction;
