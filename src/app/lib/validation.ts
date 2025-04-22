'use server';

import { z } from 'zod';
import { CaptureMethod, PaymentMethod } from '@mollie/api-client';

export async function validateFormData(formData: FormData) {
    const form = Object.fromEntries(formData.entries());

    const formSchema = z.object({
        firstname: z
            .string()
            .min(1, { message: 'Must be at least 1 character long.' }),
        lastname: z
            .string()
            .min(1, { message: 'Must be at least 1 character long.' }),
        company: z.string().optional(),
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
        country: z.string().toUpperCase().length(2),
        payment_method: z.union([
            z.nativeEnum(PaymentMethod),
            z.literal('paybybank'), // paybybank is not available in the mollie API client yet
        ]),
        cardToken: z.string().startsWith('tkn_').optional(),
        captureMode: z.nativeEnum(CaptureMethod).optional(),
        currency: z.string().length(3),
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

export async function validateCurrency(currency: string) {
    const currencySchema = z.string().length(3);
    try {
        const result = currencySchema.parse(currency);
        return result;
    } catch (error) {
        throw new Error(`No valid currency.`);
    }
}

export async function validateCountry(country: string) {
    const currencySchema = z.string().toUpperCase().length(2);
    try {
        const result = currencySchema.parse(country);
        return result;
    } catch (error) {
        throw new Error(`No valid country.`);
    }
}
