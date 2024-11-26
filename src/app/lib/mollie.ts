'use server';

import createMollieClient, { Payment } from '@mollie/api-client';
const apiKey = process.env.MOLLIE_API_KEY;
const domain = process.env.DOMAIN || 'http://localhost:3000';
const webhookUrl = process.env.WEBHOOK_URL || 'http://not.provided';

if (!apiKey) {
    throw new Error('MOLLIE_API_KEY is not defined');
}

// Set up Mollie API client
const mollieClient = createMollieClient({ apiKey: apiKey });

// Create a simple payment using data gathered from the checkout form
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
}: {
    firstname: string;
    lastname: string;
    company: string;
    email: string;
    address: string;
    city: string;
    zip_code: string;
    country: string;
    payment_method: string | undefined;
}) {
    // we need to construct the billingAdress object first as long as this isn't fixed:
    // https://github.com/mollie/mollie-api-node/issues/390#issuecomment-2467604847
    const billingAddress = {
        givenName: firstname,
        familyName: lastname,
        organizationName: company,
        streetAndNumber: address,
        postalCode: zip_code,
        city: city,
        country: country,
        email: email,
    };
    // set up the actual payment with mollie library
    const payment: Payment = await mollieClient.payments.create({
        amount: {
            currency: 'EUR',
            value: '220.00',
        },
        description: 'Demo payment from ' + firstname,
        redirectUrl: domain + '/success',
        cancelUrl: domain,
        webhookUrl: webhookUrl,
        method: payment_method as undefined, // undefined for now
        ...{ billingAddress },
    });
    console.log(domain);
    const redirectUrl = payment.getCheckoutUrl();
    return redirectUrl;
}

export async function mollieGetPayments() {
    const payments = await mollieClient.payments.page({ limit: 10 });
    return payments;
}
