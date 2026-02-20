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

export async function createSessionPayment(sessionId: string) {
    try {
        const payment = await mollieCreateSessionPayment(sessionId);
        console.log('Payment created successfully:', payment);
        return;
    } catch (error) {
        console.error('Error creating session payment:', error);
        throw new Error('Failed to create session payment');
    }
}
