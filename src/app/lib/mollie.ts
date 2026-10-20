'use server';

import { Client } from 'mollie-api-typescript';
import type { Locale2 } from 'mollie-api-typescript/models';
import { CreatePaymentParams, ALWAYS_AUTHORIZE_METHODS, ShippingOption } from './types';

const accessToken = process.env.MOLLIE_ACCESS_TOKEN;
const profileId = process.env.NEXT_PUBLIC_MOLLIE_PROFILE;
const domain = process.env.DOMAIN || 'http://localhost:3000';
const webhookUrl = process.env.WEBHOOK_URL || 'http://not.provided';

if (!accessToken) {
    throw new Error('MOLLIE_ACCESS_TOKEN is not defined');
}

if (!profileId) {
    throw new Error('NEXT_PUBLIC_MOLLIE_PROFILE is not defined');
}

// One organization access token covers test payments, live payments,
// Sessions and Balances. The SDK injects profileId into every request that
// needs it; test vs live is chosen per request with the testmode flag.
const mollieClient = new Client({
    security: { advancedAccessToken: accessToken },
    profileId,
});

// translate countries to locales
const countryToLocale: Record<string, Locale2> = {
    DE: 'de_DE',
    AT: 'de_AT',
    NL: 'nl_NL',
    FR: 'fr_FR',
    UK: 'en_US',
    SE: 'sv_SE',
    PT: 'pt_PT',
    IT: 'it_IT',
    CH: 'de_CH',
    ES: 'es_ES',
};

// function to get the locale for a given country
function getLocaleForCountry(country: string): Locale2 {
    return countryToLocale[country] ?? 'en_US'; // default to English if country is not found
}

// Extract the `from` cursor out of a pagination link
function cursorFromLink(link?: { href?: string } | null): string | undefined {
    if (!link?.href) return undefined;
    return new URL(link.href).searchParams.get('from') ?? undefined;
}

// Create a payment using data gathered from the checkout form
export async function mollieCreatePayment({
    firstname,
    lastname,
    company,
    email,
    address,
    city,
    zip_code,
    country,
    payment_method,
    cardToken,
    captureMode,
    currency,
}: CreatePaymentParams) {
    // These methods always require manual capture regardless of client input
    if ((ALWAYS_AUTHORIZE_METHODS as readonly string[]).includes(payment_method)) {
        captureMode = 'manual';
    }

    // set up the actual payment with mollie library
    const payment = await mollieClient.payments.create({
        paymentRequest: {
            amount: {
                currency: currency,
                value: '220.00',
            },
            billingAddress: {
                givenName: firstname,
                familyName: lastname,
                organizationName: company,
                streetAndNumber: address,
                postalCode: zip_code,
                city: city,
                country: country,
                email: email,
            },
            metadata: {
                internal_payment_id: 'mollie-next-' + Date.now(),
            },
            lines: [
                {
                    description: 'An expensive product',
                    quantity: 1,
                    unitPrice: {
                        currency: currency,
                        value: '200.00',
                    },
                    totalAmount: {
                        currency: currency,
                        value: '200.00',
                    },
                },
                {
                    description: 'A cheap product',
                    quantity: 1,
                    unitPrice: {
                        currency: currency,
                        value: '10.00',
                    },
                    totalAmount: {
                        currency: currency,
                        value: '10.00',
                    },
                    // categories for voucher payments
                    categories: ['gift', 'eco'],
                },
                {
                    description: 'Another cheap product',
                    quantity: 1,
                    unitPrice: {
                        currency: currency,
                        value: '10.00',
                    },
                    totalAmount: {
                        currency: currency,
                        value: '10.00',
                    },
                    // categories for voucher payments
                    categories: ['gift', 'eco'],
                },
            ],
            description: 'Demo payment from ' + firstname,
            redirectUrl: domain + '/success',
            cancelUrl: domain,
            webhookUrl: webhookUrl,
            method: payment_method,
            cardToken: cardToken,
            captureMode: captureMode,
            locale: getLocaleForCountry(country),
            testmode: true,
        },
    });
    return payment.links.checkout?.href;
}

export async function mollieGetPayments(
    opts: {
        mode?: 'test' | 'live';
        from?: string;
        limit?: number;
    } = {},
) {
    const { mode = 'test', from, limit = 20 } = opts;
    // list() returns a page iterator; we only need the first page because
    // paging is driven by the `from` cursor in the URL.
    const { result } = await mollieClient.payments.list({
        limit,
        from,
        testmode: mode === 'test',
    });
    return {
        payments: result.embedded.payments ?? [],
        nextPageCursor: cursorFromLink(result.links.next),
        previousPageCursor: cursorFromLink(result.links.previous),
    };
}

// only get the latest payment
export async function mollieGetLatestPaymentStatus() {
    const { payments } = await mollieGetPayments({ limit: 1 });
    if (!payments[0]) {
        throw new Error('No payments found');
    }
    return payments[0].status;
}

// Get a specific payment by its ID, together with its captures and refunds.
// The SDK's response schema has no `_embedded` field (unknown keys are
// stripped during validation), so `embed=captures,refunds` would be lost —
// fetch the two lists alongside the payment instead.
export async function mollieGetPayment(
    id: string,
    mode: 'test' | 'live' = 'test',
) {
    const testmode = mode === 'test';
    const [payment, captures, refunds] = await Promise.all([
        mollieClient.payments.get({ paymentId: id, testmode }),
        mollieClient.captures.list({ paymentId: id, testmode }),
        mollieClient.refunds.list({ paymentId: id, testmode }),
    ]);
    return {
        payment,
        captures: captures.result.embedded.captures,
        refunds: refunds.result.embedded.refunds,
    };
}

// Get the available payment methods in the checkout
// we're passing some additional info like sequencetype, locale and amount
// this way we can filter the available payment methods.

export async function mollieGetMethods(
    currency: string = 'EUR',
    country: string = 'DE',
) {
    const locale = getLocaleForCountry(country);
    console.debug(
        'Retrieving payment methods for combination: ' +
            country +
            ' ' +
            locale +
            ' ' +
            currency,
    );
    const { embedded } = await mollieClient.methods.list({
        sequenceType: 'oneoff',
        locale: locale,
        resource: 'payments',
        amount: { currency: currency, value: '220.00' },
        billingCountry: country,
        testmode: true,
    });
    return embedded.methods;
}
export async function mollieCapturePayment(
    id: string,
    mode: 'test' | 'live' = 'test',
    amount?: { value: string; currency: string },
) {
    console.debug('Capturing payment with id: ' + id);
    return mollieClient.captures.create({
        paymentId: id,
        entityCapture: { ...(amount ? { amount } : {}), testmode: mode === 'test' },
    });
}

export async function mollieReleaseAuthorization(
    id: string,
    mode: 'test' | 'live' = 'test',
) {
    return mollieClient.payments.releaseAuthorization({
        paymentId: id,
        requestBody: { testmode: mode === 'test' },
    });
}

export async function mollieRefundPayment(
    id: string,
    mode: 'test' | 'live' = 'test',
    amount: { value: string; currency: string },
) {
    return mollieClient.refunds.create({
        paymentId: id,
        refundRequest: { amount, testmode: mode === 'test' },
    });
}

// mollieCreateSession creates a Mollie Session, which is the starting point for
// Express Components. The session returns a clientAccessToken that is passed to
// the client-side Mollie2.Checkout() initializer in MollieV2Component.
// Sessions run in live mode because Express Components only work in live mode.
//
// payment.webhookUrl is set so it carries over to the Payment the Session
// creates automatically — this is how we still get notified for fulfilment.
//
// requiredCustomerDetails opts the session into Express address collection
// (private beta): Mollie collects these details via the Express Component and
// returns them on the session's / payment's billingAddress and shippingAddress.
// See https://docs.mollie.com/docs/collect-customer-details-with-express-component
//
// shippingOptions offers selectable delivery options alongside that address
// collection. They are sent to the API nested under shipping.options.
export async function mollieCreateSession(
    currency: string = 'EUR',
    requiredCustomerDetails?: Array<
        'email' | 'billing-address' | 'shipping-address'
    >,
    shippingOptions?: ShippingOption[],
) {
    try {
        const session = await mollieClient.checkoutSessions.create({
            sessionRequest: {
                description: 'Order #1234',
                amount: {
                    value: '0.02',
                    currency: currency,
                },
                redirectUrl: domain + '/success',
                payment: {
                    webhookUrl: webhookUrl,
                },
                ...(requiredCustomerDetails?.length
                    ? { requiredCustomerDetails }
                    : {}),
                ...(shippingOptions?.length
                    ? { shipping: { options: shippingOptions } }
                    : {}),
                lines: [
                    {
                        description: 'Demo Product',
                        quantity: 1,
                        unitPrice: {
                            currency: currency,
                            value: '0.02',
                        },
                        totalAmount: {
                            currency: currency,
                            value: '0.02',
                        },
                    },
                ],
                testmode: false,
            },
        });
        return session;
    } catch (error) {
        console.error('Error creating Mollie session:', error);
        throw error;
    }
}

// Balances API — live mode only.
export async function mollieGetPrimaryBalance() {
    return mollieClient.balances.getPrimary();
}

export async function mollieGetBalanceTransactions(
    opts: { balanceId?: string; from?: string; limit?: number } = {},
) {
    const { balanceId = 'primary', from, limit = 20 } = opts;
    const { result } = await mollieClient.balances.listTransactions({
        balanceId,
        from,
        limit,
    });

    return {
        transactions: result.embedded.balanceTransactions,
        nextPageCursor: cursorFromLink(result.links.next),
        // Deliberately not exposing a `previousPageCursor`: verified against
        // the live API that `_links.previous` on this endpoint is always
        // null, even several pages deep — Mollie just doesn't provide
        // backward cursors here. BalancesControls tracks back-navigation
        // itself via a history stack in the URL instead of relying on this.
    };
}
// The Balances API has no "get single transaction" endpoint — only the list
// above. `from` is documented as inclusive ("start from the item with the
// given ID and onwards"), so asking for exactly one result starting at this
// ID returns the transaction itself. We double-check the ID we get back
// matches, in case it doesn't exist and the API just returns whatever is
// next in the list instead of a 404.
export async function mollieGetBalanceTransaction(
    id: string,
    balanceId: string = 'primary',
) {
    const { transactions } = await mollieGetBalanceTransactions({
        balanceId,
        from: id,
        limit: 1,
    });
    const transaction = transactions[0];
    if (!transaction || transaction.id !== id) {
        throw new Error(`Balance transaction ${id} not found`);
    }
    return transaction;
}
