'use server';

import createMollieClient, {
    CaptureMethod,
    Locale,
    Payment,
    SequenceType,
    PaymentLineCategory,
} from '@mollie/api-client';
import {
    CreatePaymentParams,
    ALWAYS_AUTHORIZE_METHODS,
    ShippingOption,
    Balance,
    BalanceTransaction,
} from './types';

const apiKey = process.env.MOLLIE_API_KEY;
const liveApiKey = process.env.MOLLIE_LIVE_API_KEY;
const domain = process.env.DOMAIN || 'http://localhost:3000';
const webhookUrl = process.env.WEBHOOK_URL || 'http://not.provided';

if (!apiKey) {
    throw new Error('MOLLIE_API_KEY is not defined');
}

if (!liveApiKey) {
    throw new Error('MOLLIE_LIVE_API_KEY is not defined');
}

// Set up Mollie API client
const mollieClient = createMollieClient({ apiKey: apiKey });
const livePaymentsClient = createMollieClient({ apiKey: liveApiKey! });

// translate countries to locales
const countryToLocale: Record<string, Locale> = {
    DE: Locale.de_DE,
    AT: Locale.de_AT,
    NL: Locale.nl_NL,
    FR: Locale.fr_FR,
    UK: Locale.en_US,
    SE: Locale.sv_SE,
    PT: Locale.pt_PT,
    IT: Locale.it_IT,
    CH: Locale.de_CH,
    ES: Locale.es_ES,
};

// function to get the locale for a given country
function getLocaleForCountry(country: string): Locale {
    let locale = countryToLocale[country];
    if (!locale) {
        locale = Locale.en_US; // default to English if country is not found
    }
    return locale;
}

// Pick the test or live API client for a given mode
function getClient(mode: 'test' | 'live' = 'test') {
    return mode === 'live' ? livePaymentsClient : mollieClient;
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
    // Note: We allow beta payment methods to be sent to the API
    // The Mollie API will handle validation and return appropriate errors if needed
    // This allows testing of beta payment methods that aren't in the TypeScript client yet

    // These methods always require manual capture regardless of client input
    if (ALWAYS_AUTHORIZE_METHODS.includes(payment_method as any)) {
        captureMode = CaptureMethod.manual;
    }

    // set up the actual payment with mollie library
    const payment: Payment = await mollieClient.payments.create({
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
                categories: [PaymentLineCategory.gift, PaymentLineCategory.eco],
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
                categories: [PaymentLineCategory.gift, PaymentLineCategory.eco],
            },
        ],
        description: 'Demo payment from ' + firstname,
        redirectUrl: domain + '/success',
        cancelUrl: domain,
        webhookUrl: webhookUrl,
        method: payment_method as any, // Allow beta payment methods to be sent to API
        cardToken: cardToken,
        captureMode: captureMode,
        locale: getLocaleForCountry(country),
    });
    const redirectUrl = payment.getCheckoutUrl();
    return redirectUrl;
}

export async function mollieGetPayments(
    opts: {
        mode?: 'test' | 'live';
        from?: string;
        limit?: number;
    } = {},
) {
    const { mode = 'test', from, limit = 20 } = opts;
    const client = getClient(mode);
    const page = await client.payments.page({
        limit,
        ...(from ? { from } : {}),
    });
    return {
        payments: Array.from(page),
        nextPageCursor: page.nextPageCursor,
        previousPageCursor: page.previousPageCursor,
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

// Get a specific payment by its ID, with captures embedded
export async function mollieGetPayment(
    id: string,
    mode: 'test' | 'live' = 'test',
) {
    const client = getClient(mode);
    const payment = await client.payments.get(id, {
        embed: ['captures', 'refunds'],
    } as any);
    return payment;
}

// Get the available payment methods in the checkout
// we're passing some additional info like sequencetype, locale and amount
// this way we can filter the available payment methods.

export async function mollieGetMethods(
    currency: string = 'EUR',
    country: string = 'DE',
) {
    let locale = Locale.en_US;
    locale = getLocaleForCountry(country);
    console.debug(
        'Retrieving payment methods for combination: ' +
            country +
            ' ' +
            locale +
            ' ' +
            currency,
    );
    const methods = await mollieClient.methods.list({
        sequenceType: SequenceType.oneoff,
        locale: locale,
        resource: 'payments',
        amount: { currency: currency, value: '220.00' },
        billingCountry: country,
    });
    return methods;
}
export async function mollieCapturePayment(
    id: string,
    mode: 'test' | 'live' = 'test',
    amount?: { value: string; currency: string },
) {
    const client = getClient(mode);
    console.debug('Capturing payment with id: ' + id);
    const capture = await client.paymentCaptures.create({
        paymentId: id,
        ...(amount ? { amount } : {}),
    });
    return capture;
}

export async function mollieReleaseAuthorization(
    id: string,
    mode: 'test' | 'live' = 'test',
) {
    const client = getClient(mode);
    return client.payments.releaseAuthorization(id);
}

export async function mollieRefundPayment(
    id: string,
    mode: 'test' | 'live' = 'test',
    amount: { value: string; currency: string },
) {
    const client = getClient(mode);
    return client.paymentRefunds.create({ paymentId: id, amount });
}

// mollieCreateSession creates a Mollie Session, which is the starting point for
// Express Components. The session returns a clientAccessToken that is passed to
// the client-side Mollie2.Checkout() initializer in MollieV2Component.
// Sessions use the live API key because Express Components only work in live mode.
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
        const session = await fetch('https://api.mollie.com/v2/sessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + liveApiKey,
            },
            body: JSON.stringify({
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
            }),
        });

        if (!session.ok) {
            throw new Error(
                `Failed to create session: ${session.status} ${session.statusText}`,
            );
        }

        const { id, clientAccessToken } = await session.json();
        return { sessionId: id, clientAccessToken: clientAccessToken };
    } catch (error) {
        console.error('Error creating Mollie session:', error);
        throw error;
    }
}

// Balances API — live mode only, and not part of @mollie/api-client 4.x,
// so these call the REST API directly. Profile API keys get a 403 here; the
// endpoint needs an organization access token (access_…).
async function mollieLiveGet<T>(path: string): Promise<T> {
    const accessToken = process.env.MOLLIE_ACCESS_TOKEN;
    if (!accessToken) {
        throw new Error('MOLLIE_ACCESS_TOKEN is not set');
    }
    const response = await fetch('https://api.mollie.com/v2' + path, {
        headers: { Authorization: 'Bearer ' + accessToken },
        cache: 'no-store',
    });
    if (!response.ok) {
        const body = await response.text();
        // Logged as an object, not a template literal with trailing args —
        // `path` is influenced by caller-supplied IDs, and console.error
        // treats a string first argument as a util.format format string.
        // A path containing e.g. "%s" would otherwise consume `body` as a
        // substitution and garble the log (CodeQL js/tainted-format-string).
        console.error('Mollie GET failed', {
            path,
            status: response.status,
            body,
        });
        throw new Error(`Mollie GET ${path} failed with ${response.status}`);
    }
    return response.json() as Promise<T>;
}

function cursorFromLink(link?: { href: string } | null): string | undefined {
    if (!link?.href) return undefined;
    return new URL(link.href).searchParams.get('from') ?? undefined;
}

export async function mollieGetPrimaryBalance() {
    return mollieLiveGet<Balance>('/balances/primary');
}

export async function mollieGetBalanceTransactions(
    opts: { balanceId?: string; from?: string; limit?: number } = {},
) {
    const { balanceId = 'primary', from, limit = 20 } = opts;
    const params = new URLSearchParams({ limit: String(limit) });
    if (from) params.set('from', from);

    // Note: we only request `next` from the API — see nextPageCursor below.
    const data = await mollieLiveGet<{
        _embedded: { balance_transactions: BalanceTransaction[] };
        _links: {
            next?: { href: string } | null;
            previous?: { href: string } | null;
        };
    }>(`/balances/${encodeURIComponent(balanceId)}/transactions?${params}`);

    return {
        transactions: data._embedded.balance_transactions,
        nextPageCursor: cursorFromLink(data._links.next),
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
