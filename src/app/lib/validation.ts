'use server';

import { z } from 'zod';

export async function validateFormData(formData: FormData) {
    const form = Object.fromEntries(formData.entries());

    const formSchema = z.object({
        firstname: z
            .string()
            .min(1, { message: 'Must be at least 1 character long.' }),
        lastname: z
            .string()
            .min(1, { message: 'Must be at least 1 character long.' }),
        company: z
            .string()
            .min(1, { message: 'Must be at least 1 character long.' }),
        email: z.string().email({ message: 'Must be valid email address.' }),
        address: z
            .string()
            .min(1, { message: 'Must be at least 1 character long.' }),
        city: z
            .string()
            .min(1, { message: 'Must be at least 1 character long.' }),
        zip_code: z
            .string()
            .min(1, { message: 'Must be at least 1 character long.' }),
        country: z.string().length(2),
        payment_method: z.string(),
    });

    try {
        const result = formSchema.parse(form);
        return result;
    } catch (error) {
        throw new Error(`Computer says no: ${error}`);
    }
}

export async function validateUrl(url: string) {
    const urlSchema = z.string().url();
    try {
        const result = urlSchema.parse(url);
        return result;
    } catch (error) {
        throw new Error(`No valid URL.`);
    }
}

export async function validateMolliePayment(id: string) {
    const paymentSchema = z.string().startsWith('tr_');
    try {
        const result = paymentSchema.parse(id);
        return result;
    } catch (error) {
        throw new Error(`No valid Mollie payment ID.`);
    }
}

// types

// type for checkout variant
export type checkoutVariant = 'hosted' | 'components';
