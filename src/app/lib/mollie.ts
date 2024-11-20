"use server";

import createMollieClient from '@mollie/api-client';
const apiKey = process.env.MOLLIE_API_KEY;

if (!apiKey) {
  throw new Error('MOLLIE_API_KEY is not defined');
}

const mollieClient = createMollieClient({ apiKey: apiKey });
  
  // Forward the customer to payment.getCheckoutUrl().

export async function mollieCreateOrder(
    {
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
        payment_method: string;
      }
) {
    const payment = await mollieClient.payments.create({
        "amount": {
            "currency": "EUR",
            "value": "1020.00"
        },
        "description": "Demo payment from " + firstname,
        "redirectUrl": "https:\/\/google.com",
        "cancelUrl": "https:\/\/bing.com",
        "webhookUrl": "https:\/\/webhook.site\/50e5edca-396e-40ec-82fe-59f08c71b077",
        "method": payment_method,
        "billingAddress": {
            "givenName": firstname,
            "familyName": lastname,
            "organizationName": company,
            "streetAndNumber": address,
            "postalCode": zip_code,
            "city": city,
            "country": country,
            "email": email
        }
    });
    const redirectUrl = payment.getCheckoutUrl();
    // console.log(payment);
    return redirectUrl;
  }