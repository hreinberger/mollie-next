'use server';

// Lib
import { validateFormData, validateUrl } from '@/app/lib/validation';
import {
    mollieCreatePayment,
    mollieCreateSessionPayment,
} from '@/app/lib/mollie';
import { PaymentMethod, CaptureMethod } from '@mollie/api-client';
import { ExtendedPaymentMethodType } from '@/app/lib/types';

// Next.js
import { redirect } from 'next/navigation';

export async function createPayment(formData: FormData) {
    // This Server Action takes the form data, validates it and creates a payment
    // Always validate user input
    const validatedForm: {
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
    } = await validateFormData(formData);

    // Create a payment with the validated form data and retrieve the redirect URL
    const mollieRedirectUrl: string | null = await mollieCreatePayment(
        validatedForm
    );
    if (!mollieRedirectUrl) {
        throw new Error('Failed to create Mollie payment');
    }

    // we also validate the redirect URL
    const validatedRedirectUrl = await validateUrl(mollieRedirectUrl);

    // redirect to Mollie hosted checkout
    redirect(validatedRedirectUrl);
}

// createSessionPayment is called by the Express Component (SessionWrapper) when
// the user has selected a payment method and the SDK fires 'readyforpayment'.
// Unlike createPayment, there is no redirect — the Express Component handles
// the payment flow entirely on the client side after the payment is created.
export async function createSessionPayment(sessionId: string) {
    await mollieCreateSessionPayment(sessionId);
}
