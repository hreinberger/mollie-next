'use server';

// Lib
import { validateFormData, validateUrl } from '@/app/lib/validation';
import { mollieCreatePayment } from '@/app/lib/mollie';

// Next.js
import { redirect } from 'next/navigation';

export async function createPayment(formData: FormData) {
    // This Server Action takes the form data, validates it and creates a payment
    // The 'use server' pragma is used to indicate that this function should be run on the server

    // Always validate user input
    const validatedForm: {
        firstname: string;
        lastname: string;
        company: string;
        email: string;
        address: string;
        city: string;
        zip_code: string;
        country: string;
        payment_method: string | undefined;
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
